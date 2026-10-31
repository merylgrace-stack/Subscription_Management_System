import os
import sys
import django
from decimal import Decimal
from datetime import timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.utils import timezone
from django.contrib.auth import get_user_model
from apps.customers.models import Customer
from apps.catalog.models import Product, ProductVariant, SubscriptionPlan, DiscountRule, TaxRule
from apps.quotations.models import Quotation, QuotationItem
from apps.subscriptions.models import Subscription, SubscriptionItem
from apps.billing.models import Invoice, InvoiceItem
from apps.payments.models import Payment
from apps.calendar_events.models import CalendarEvent
from apps.notifications.models import Notification

User = get_user_model()

def seed():
    print("Seeding Brightloop Software database...")

    # 1. Customers
    acme, _ = Customer.objects.get_or_create(
        customer_code='CUST-001',
        defaults={
            'company_name': 'Acme Global Corp',
            'contact_name': 'John Doe',
            'email': 'john@acme.com',
            'phone': '+1 (555) 234-5678',
            'billing_address': '100 Enterprise Way, Suite 400, San Francisco, CA 94105',
            'tax_id': 'US-94-2849182',
            'status': Customer.Status.ACTIVE,
        }
    )

    techvanguard, _ = Customer.objects.get_or_create(
        customer_code='CUST-002',
        defaults={
            'company_name': 'TechVanguard Inc',
            'contact_name': 'Elena Rostova',
            'email': 'elena@techvanguard.io',
            'phone': '+1 (555) 987-6543',
            'billing_address': '450 Innovation Parkway, Austin, TX 78701',
            'tax_id': 'US-74-8839201',
            'status': Customer.Status.ACTIVE,
        }
    )

    nexus, _ = Customer.objects.get_or_create(
        customer_code='CUST-003',
        defaults={
            'company_name': 'Nexus Logistics LLC',
            'contact_name': 'Marcus Vance',
            'email': 'marcus@nexuslogistics.com',
            'phone': '+1 (555) 345-6789',
            'billing_address': '800 Port Boulevard, Chicago, IL 60607',
            'tax_id': 'US-36-5544332',
            'status': Customer.Status.ACTIVE,
        }
    )

    # 2. Users
    admin_user, _ = User.objects.get_or_create(
        email='admin@brightloop.io',
        defaults={
            'first_name': 'Alex',
            'last_name': 'Drake',
            'role': User.Role.ADMIN,
            'is_staff': True,
            'is_superuser': True,
        }
    )
    admin_user.set_password('AdminPass123!')
    admin_user.save()

    staff_user, _ = User.objects.get_or_create(
        email='staff@brightloop.io',
        defaults={
            'first_name': 'Sarah',
            'last_name': 'Connor',
            'role': User.Role.STAFF,
            'is_staff': True,
        }
    )
    staff_user.set_password('StaffPass123!')
    staff_user.save()

    finance_user, _ = User.objects.get_or_create(
        email='finance@brightloop.io',
        defaults={
            'first_name': 'Frank',
            'last_name': 'Miller',
            'role': User.Role.FINANCE,
            'is_staff': True,
        }
    )
    finance_user.set_password('FinancePass123!')
    finance_user.save()

    customer_user, _ = User.objects.get_or_create(
        email='john@acme.com',
        defaults={
            'first_name': 'John',
            'last_name': 'Doe',
            'role': User.Role.CUSTOMER,
            'customer_profile': acme,
        }
    )
    customer_user.set_password('CustomerPass123!')
    customer_user.save()

    # 3. Catalog Products & Variants
    platform, _ = Product.objects.get_or_create(
        name='Brightloop Enterprise Platform',
        defaults={
            'product_type': Product.ProductType.SUBSCRIPTION,
            'description': 'Full-suite recurring billing, revenue recognition and orchestration engine.',
            'base_sales_price': Decimal('1200.0000'),
            'cost_price': Decimal('250.0000'),
            'is_active': True,
        }
    )

    # Variant with configurable surcharge of 560 currency units per prompt Part 3.2
    odoo_variant, _ = ProductVariant.objects.get_or_create(
        product=platform,
        name='Odoo Enterprise Connector',
        defaults={
            'additional_price_adjustment': Decimal('560.0000'),
            'is_active': True,
        }
    )

    salesforce_variant, _ = ProductVariant.objects.get_or_create(
        product=platform,
        name='Salesforce Sync Gateway',
        defaults={
            'additional_price_adjustment': Decimal('450.0000'),
            'is_active': True,
        }
    )

    starter_suite, _ = Product.objects.get_or_create(
        name='Brightloop Starter Suite',
        defaults={
            'product_type': Product.ProductType.SUBSCRIPTION,
            'description': 'Core billing and customer checkout portal for fast-growth startups.',
            'base_sales_price': Decimal('299.0000'),
            'cost_price': Decimal('50.0000'),
            'is_active': True,
        }
    )

    # 4. Subscription Plans
    plan_monthly, _ = SubscriptionPlan.objects.get_or_create(
        name='Enterprise Monthly',
        defaults={
            'base_recurring_fee': Decimal('1200.0000'),
            'billing_frequency': SubscriptionPlan.BillingFrequency.MONTHLY,
            'minimum_purchase_quantity': 1,
            'auto_close_on_expiry': True,
            'allow_early_cancellation': True,
            'allow_pausing': True,
            'allow_renewal': True,
            'is_active': True,
        }
    )

    plan_annual, _ = SubscriptionPlan.objects.get_or_create(
        name='Enterprise Annual',
        defaults={
            'base_recurring_fee': Decimal('12000.0000'),
            'billing_frequency': SubscriptionPlan.BillingFrequency.YEARLY,
            'minimum_purchase_quantity': 1,
            'auto_close_on_expiry': True,
            'allow_early_cancellation': True,
            'allow_pausing': True,
            'allow_renewal': True,
            'is_active': True,
        }
    )

    # 5. Tax & Discount Rules
    tax_vat, _ = TaxRule.objects.get_or_create(
        name='Standard Corporate VAT',
        defaults={
            'tax_type': TaxRule.TaxType.VAT,
            'rate_percentage': Decimal('10.0000'),
            'country_code': 'GLOBAL',
            'is_active': True,
        }
    )

    discount_promo, _ = DiscountRule.objects.get_or_create(
        code='PROMO15',
        defaults={
            'name': 'Q4 Enterprise Expansion Discount',
            'discount_type': DiscountRule.DiscountType.PERCENTAGE,
            'value': Decimal('15.0000'),
            'min_spend': Decimal('1000.0000'),
            'is_active': True,
        }
    )

    # 6. Active Subscriptions
    today = timezone.now().date()
    sub_acme, _ = Subscription.objects.get_or_create(
        subscription_code='SUB-ACME-001',
        defaults={
            'customer': acme,
            'plan': plan_monthly,
            'status': Subscription.Status.ACTIVE,
            'start_date': today - timedelta(days=90),
            'next_billing_date': today + timedelta(days=7),
            'billing_frequency': 'MONTHLY',
            'payment_terms': 'NET 30',
            'total_recurring_amount': Decimal('1936.0000'),
        }
    )

    if not sub_acme.items.exists():
        SubscriptionItem.objects.create(
            subscription=sub_acme,
            product=platform,
            variant=odoo_variant,
            quantity=1,
            unit_price=platform.base_sales_price,
            variant_adjustment=odoo_variant.additional_price_adjustment,
            discount_amount=Decimal('0.0000'),
            tax_rate=tax_vat.rate_percentage,
            line_total=Decimal('1936.0000'), # (1200 + 560) * 1.10 = 1936.00
        )

    # 7. Invoices & Payments
    inv_paid, _ = Invoice.objects.get_or_create(
        invoice_number='INV-2026-001',
        defaults={
            'customer': acme,
            'subscription': sub_acme,
            'billing_period_start': today - timedelta(days=60),
            'billing_period_end': today - timedelta(days=30),
            'invoice_date': today - timedelta(days=60),
            'due_date': today - timedelta(days=30),
            'subtotal': Decimal('1760.0000'),
            'discount_total': Decimal('0.0000'),
            'tax_total': Decimal('176.0000'),
            'grand_total': Decimal('1936.0000'),
            'amount_paid': Decimal('1936.0000'),
            'outstanding_balance': Decimal('0.0000'),
            'status': Invoice.Status.PAID,
            'is_frozen': True,
        }
    )

    Payment.objects.get_or_create(
        transaction_id='TXN-ACME-PAID-01',
        defaults={
            'customer': acme,
            'invoice': inv_paid,
            'amount': Decimal('1936.0000'),
            'payment_method': Payment.Method.BANK_TRANSFER,
            'payment_status': Payment.Status.SUCCESS,
            'is_reconciled': True,
            'reconciled_by': finance_user,
        }
    )

    # Overdue invoice for receivables & collections demonstration
    inv_overdue, _ = Invoice.objects.get_or_create(
        invoice_number='INV-2026-002',
        defaults={
            'customer': techvanguard,
            'subscription': None,
            'billing_period_start': today - timedelta(days=45),
            'billing_period_end': today - timedelta(days=15),
            'invoice_date': today - timedelta(days=45),
            'due_date': today - timedelta(days=15),
            'subtotal': Decimal('1200.0000'),
            'discount_total': Decimal('0.0000'),
            'tax_total': Decimal('120.0000'),
            'grand_total': Decimal('1320.0000'),
            'amount_paid': Decimal('0.0000'),
            'outstanding_balance': Decimal('1320.0000'),
            'status': Invoice.Status.CONFIRMED,
            'is_frozen': True,
        }
    )

    # 8. Calendar Reminders (Auto-scheduled)
    CalendarEvent.objects.get_or_create(
        idempotent_key=f"OVERDUE_{inv_overdue.id}",
        defaults={
            'event_type': CalendarEvent.EventType.PAYMENT_DUE,
            'title': f"Collections Follow-up: Invoice {inv_overdue.invoice_number}",
            'description': f"Invoice of ${inv_overdue.outstanding_balance} for TechVanguard is overdue.",
            'event_date': today,
            'status': CalendarEvent.Status.PENDING,
            'assigned_to': finance_user,
            'related_customer': techvanguard,
            'related_invoice': inv_overdue,
        }
    )

    CalendarEvent.objects.get_or_create(
        idempotent_key=f"SUB_RENEW_{sub_acme.id}",
        defaults={
            'event_type': CalendarEvent.EventType.RENEWAL_REMINDER,
            'title': f"Subscription Renewal Review: {sub_acme.subscription_code}",
            'description': f"Acme Global Corp subscription renewal scheduled in 7 days.",
            'event_date': today + timedelta(days=7),
            'status': CalendarEvent.Status.PENDING,
            'assigned_to': staff_user,
            'related_customer': acme,
            'related_subscription': sub_acme,
        }
    )

    print("Seed data successfully populated!")

if __name__ == '__main__':
    seed()
