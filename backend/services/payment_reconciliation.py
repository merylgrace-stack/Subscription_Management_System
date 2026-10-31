from decimal import Decimal
from django.db import transaction
from django.db.models import Sum
from apps.billing.models import Invoice
from apps.payments.models import Payment
from services.pricing import round_currency
from services.invoice_state import InvoiceStateMachine

class PaymentReconciliationService:
    """
    Handles payment recording and automatic invoice status reconciliation per Part 4.2.
    """

    @classmethod
    @transaction.atomic
    def record_and_reconcile(cls, invoice_id: int, amount: Decimal, payment_method: str, transaction_id: str = None, notes: str = '', user=None) -> Payment:
        # Lock invoice for update
        invoice = Invoice.objects.select_for_update().get(id=invoice_id)

        if invoice.status == Invoice.Status.CANCELLED:
            raise ValueError("Cannot apply payments to a cancelled invoice.")

        if invoice.status == Invoice.Status.DRAFT:
            # Auto-confirm invoice if draft
            InvoiceStateMachine.transition(invoice, Invoice.Status.CONFIRMED)

        amount_dec = round_currency(amount)
        if amount_dec <= Decimal('0.00'):
            raise ValueError("Payment amount must be greater than zero.")

        if not transaction_id:
            import uuid
            transaction_id = f"TXN-{uuid.uuid4().hex[:10].upper()}"

        payment = Payment.objects.create(
            transaction_id=transaction_id,
            customer=invoice.customer,
            invoice=invoice,
            amount=amount_dec,
            payment_method=payment_method,
            payment_status=Payment.Status.SUCCESS,
            is_reconciled=True,
            reconciled_by=user,
            notes=notes
        )

        # Re-calculate total successful payments
        successful_total = invoice.payments.filter(payment_status=Payment.Status.SUCCESS).aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.0000')

        invoice.amount_paid = round_currency(successful_total)
        invoice.outstanding_balance = round_currency(max(Decimal('0.0000'), invoice.grand_total - invoice.amount_paid))

        # Check if fully paid
        if invoice.amount_paid >= invoice.grand_total:
            InvoiceStateMachine.transition(invoice, Invoice.Status.PAID)
        else:
            invoice.save(update_fields=['amount_paid', 'outstanding_balance', 'updated_at'])

        return payment
