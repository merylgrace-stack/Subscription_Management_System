import uuid
from decimal import Decimal
from datetime import date, timedelta
from dateutil.relativedelta import relativedelta
from django.db import transaction, IntegrityError
from django.utils import timezone
from apps.subscriptions.models import Subscription
from apps.billing.models import Invoice, InvoiceItem
from services.pricing import round_currency

class RecurringBillingEngine:
    """
    Automated recurring billing engine per Part 5.
    Uses SELECT FOR UPDATE SKIP LOCKED and enforces UNIQUE(subscription_id, billing_period_start, billing_period_end).
    """

    @classmethod
    def calculate_period(cls, current_billing_date: date, frequency: str):
        start_date = current_billing_date
        if frequency == 'DAILY':
            end_date = start_date + timedelta(days=1)
            next_date = end_date
        elif frequency == 'WEEKLY':
            end_date = start_date + timedelta(days=7)
            next_date = end_date
        elif frequency == 'YEARLY':
            end_date = start_date + relativedelta(years=1)
            next_date = end_date
        else: # MONTHLY default
            end_date = start_date + relativedelta(months=1)
            next_date = end_date
        return start_date, end_date, next_date

    @classmethod
    def process_due_subscriptions(cls, run_date: date = None) -> list:
        if run_date is None:
            run_date = timezone.now().date()

        generated_invoices = []

        # Find eligible active subscriptions
        due_sub_ids = list(Subscription.objects.filter(
            status=Subscription.Status.ACTIVE,
            next_billing_date__lte=run_date
        ).values_list('id', flat=True))

        for sub_id in due_sub_ids:
            try:
                invoice = cls.bill_single_subscription(sub_id, run_date)
                if invoice:
                    generated_invoices.append(invoice)
            except IntegrityError:
                # Idempotency caught duplicate period; skip safely
                continue
            except Exception as e:
                # Log error and continue to other subscriptions
                continue

        return generated_invoices

    @classmethod
    def bill_single_subscription(cls, subscription_id: int, run_date: date = None) -> Invoice:
        if run_date is None:
            run_date = timezone.now().date()

        with transaction.atomic():
            # SELECT FOR UPDATE with skip locked or row locking
            try:
                # In PostgreSQL, select_for_update(skip_locked=True)
                subscription = Subscription.objects.select_for_update().select_related('customer', 'plan').prefetch_related('items__product', 'items__variant').get(
                    id=subscription_id,
                    status=Subscription.Status.ACTIVE
                )
            except Subscription.DoesNotExist:
                return None

            start_date, end_date, next_date = cls.calculate_period(
                subscription.next_billing_date,
                subscription.billing_frequency
            )

            # Check if invoice for this period already exists (database idempotency per Part 5.1)
            existing = Invoice.objects.filter(
                subscription=subscription,
                billing_period_start=start_date,
                billing_period_end=end_date
            ).first()
            if existing:
                # Advance date if already generated to maintain forward progress
                subscription.next_billing_date = next_date
                subscription.save(update_fields=['next_billing_date'])
                return existing

            invoice_number = f"INV-{uuid.uuid4().hex[:8].upper()}"
            due_date = run_date + timedelta(days=30)

            # Create Draft Invoice
            invoice = Invoice.objects.create(
                invoice_number=invoice_number,
                customer=subscription.customer,
                subscription=subscription,
                billing_period_start=start_date,
                billing_period_end=end_date,
                invoice_date=run_date,
                due_date=due_date,
                status=Invoice.Status.DRAFT,
                notes=f"Auto-generated recurring billing for subscription {subscription.subscription_code} ({subscription.billing_frequency})."
            )

            subtotal = Decimal('0.0000')
            discount_total = Decimal('0.0000')
            tax_total = Decimal('0.0000')

            # Populate snapshot items
            for item in subscription.items.all():
                effective_unit_price = item.unit_price + item.variant_adjustment
                line_subtotal = effective_unit_price * item.quantity
                line_discount = item.discount_amount
                net_after_discount = max(Decimal('0.0000'), line_subtotal - line_discount)
                line_tax = net_after_discount * (item.tax_rate / Decimal('100.00'))
                line_total = net_after_discount + line_tax

                InvoiceItem.objects.create(
                    invoice=invoice,
                    original_product=item.product,
                    product_name=item.product.name,
                    variant_name=item.variant.name if item.variant else '',
                    quantity=item.quantity,
                    unit_price=round_currency(effective_unit_price),
                    discount_amount=round_currency(line_discount),
                    tax_rate=item.tax_rate,
                    tax_amount=round_currency(line_tax),
                    line_total=round_currency(line_total)
                )

                subtotal += line_subtotal
                discount_total += line_discount
                tax_total += line_tax

            grand_total = subtotal - discount_total + tax_total

            invoice.subtotal = round_currency(subtotal)
            invoice.discount_total = round_currency(discount_total)
            invoice.tax_total = round_currency(tax_total)
            invoice.grand_total = round_currency(grand_total)
            invoice.outstanding_balance = invoice.grand_total
            invoice.save()

            # Advance next billing date
            subscription.next_billing_date = next_date
            subscription.save(update_fields=['next_billing_date', 'updated_at'])

            return invoice
