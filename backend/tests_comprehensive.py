import time
from decimal import Decimal
from datetime import timedelta
from django.test import TestCase, Client
from django.utils import timezone
from django.db import IntegrityError
from django.core.exceptions import ValidationError

from apps.accounts.models import User
from apps.customers.models import Customer
from apps.catalog.models import Product, ProductVariant, SubscriptionPlan, TaxRule
from apps.subscriptions.models import Subscription, SubscriptionItem
from apps.billing.models import Invoice, InvoiceItem
from apps.payments.models import Payment
from apps.calendar_events.models import CalendarEvent

from services.pricing import round_currency, calculate_line_item
from services.subscription_state import SubscriptionStateMachine
from services.invoice_state import InvoiceStateMachine
from services.payment_reconciliation import PaymentReconciliationService
from services.recurring_billing import RecurringBillingEngine
from services.reminder_scheduler import ReminderSchedulerService

class ComprehensiveSystemTests(TestCase):
    def setUp(self):
        self.today = timezone.now().date()
        
        # Setup customer
        self.customer = Customer.objects.create(
            customer_code='TEST-CUST-1',
            company_name='Test Horizon Ltd',
            contact_name='Alice Smith',
            email='alice@horizon.io'
        )
        
        self.customer_b = Customer.objects.create(
            customer_code='TEST-CUST-2',
            company_name='Beta Industries',
            contact_name='Bob Jones',
            email='bob@beta.io'
        )

        # Users
        self.admin = User.objects.create_superuser(email='admin@test.io', password='AdminPassword123!')
        self.customer_user = User.objects.create_user(
            email='alice@horizon.io',
            password='CustomerPassword123!',
            role=User.Role.CUSTOMER,
            customer_profile=self.customer
        )

        # Catalog
        self.product = Product.objects.create(
            name='Cloud SaaS Core',
            base_sales_price=Decimal('100.0000')
        )
        self.variant = ProductVariant.objects.create(
            product=self.product,
            name='Odoo Sync',
            additional_price_adjustment=Decimal('50.0000')
        )
        self.plan = SubscriptionPlan.objects.create(
            name='Pro Monthly',
            base_recurring_fee=Decimal('150.0000'),
            billing_frequency=SubscriptionPlan.BillingFrequency.MONTHLY,
            allow_pausing=True,
            allow_early_cancellation=True
        )

        self.sub = Subscription.objects.create(
            subscription_code='SUB-TEST-001',
            customer=self.customer,
            plan=self.plan,
            status=Subscription.Status.ACTIVE,
            start_date=self.today,
            next_billing_date=self.today,
            billing_frequency='MONTHLY',
            total_recurring_amount=Decimal('150.0000')
        )
        SubscriptionItem.objects.create(
            subscription=self.sub,
            product=self.product,
            variant=self.variant,
            quantity=1,
            unit_price=self.product.base_sales_price,
            variant_adjustment=self.variant.additional_price_adjustment,
            tax_rate=Decimal('10.0000'),
            line_total=Decimal('165.0000')
        )

    # 1. Concurrency and Idempotency Test
    def test_recurring_billing_idempotency_and_uniqueness(self):
        """Verify duplicate invoices for same subscription & period cannot be created (Part 5.1)"""
        start_date = self.today
        end_date = self.today + timedelta(days=30)
        
        inv1 = Invoice.objects.create(
            invoice_number='INV-IDEM-001',
            customer=self.customer,
            subscription=self.sub,
            billing_period_start=start_date,
            billing_period_end=end_date,
            due_date=end_date,
            grand_total=Decimal('165.0000')
        )
        self.assertIsNotNone(inv1.id)

        # Attempt duplicate creation for exact same period
        with self.assertRaises(IntegrityError):
            Invoice.objects.create(
                invoice_number='INV-IDEM-002',
                customer=self.customer,
                subscription=self.sub,
                billing_period_start=start_date,
                billing_period_end=end_date,
                due_date=end_date,
                grand_total=Decimal('165.0000')
            )

    # 2. State Transition Integrity Test
    def test_invoice_invalid_state_transition(self):
        """Verify invalid transitions are strictly rejected (e.g. DRAFT -> PAID must fail) (Part 4.1)"""
        invoice = Invoice.objects.create(
            invoice_number='INV-STAT-001',
            customer=self.customer,
            due_date=self.today,
            status=Invoice.Status.DRAFT,
            grand_total=Decimal('500.0000')
        )

        with self.assertRaises(ValidationError):
            # Direct transition from DRAFT to PAID must raise ValidationError
            InvoiceStateMachine.transition(invoice, Invoice.Status.PAID)

    def test_subscription_state_machine_transitions(self):
        """Verify permitted subscription transitions and rejection of invalid ones (Part 3.5)"""
        sub = Subscription.objects.create(
            subscription_code='SUB-FLOW-01',
            customer=self.customer,
            plan=self.plan,
            status=Subscription.Status.DRAFT,
            start_date=self.today,
            next_billing_date=self.today
        )

        # DRAFT -> CONFIRMED
        SubscriptionStateMachine.transition(sub, Subscription.Status.CONFIRMED)
        self.assertEqual(sub.status, Subscription.Status.CONFIRMED)

        # CONFIRMED -> ACTIVE
        SubscriptionStateMachine.transition(sub, Subscription.Status.ACTIVE)
        self.assertEqual(sub.status, Subscription.Status.ACTIVE)

        # ACTIVE -> PAUSED
        SubscriptionStateMachine.transition(sub, Subscription.Status.PAUSED, reason='Maintenance')
        self.assertEqual(sub.status, Subscription.Status.PAUSED)

        # PAUSED -> ACTIVE
        SubscriptionStateMachine.transition(sub, Subscription.Status.ACTIVE)
        self.assertEqual(sub.status, Subscription.Status.ACTIVE)

        # ACTIVE -> CLOSED
        SubscriptionStateMachine.transition(sub, Subscription.Status.CLOSED, reason='Contract ended')
        self.assertEqual(sub.status, Subscription.Status.CLOSED)

        # Terminal state CLOSED -> ACTIVE must fail
        with self.assertRaises(ValidationError):
            SubscriptionStateMachine.transition(sub, Subscription.Status.ACTIVE)

    # 3. Historical Invoice Immutability Test
    def test_historical_invoice_immutability(self):
        """Confirm that updating product catalog price does not alter historical confirmed invoice (Part 6.2)"""
        # Create confirmed invoice with frozen snapshot
        invoice = Invoice.objects.create(
            invoice_number='INV-IMMUT-001',
            customer=self.customer,
            due_date=self.today,
            subtotal=Decimal('150.0000'),
            grand_total=Decimal('165.0000'),
            status=Invoice.Status.CONFIRMED,
            is_frozen=True
        )
        item = InvoiceItem.objects.create(
            invoice=invoice,
            original_product=self.product,
            product_name=self.product.name,
            variant_name=self.variant.name,
            quantity=1,
            unit_price=Decimal('150.0000'),
            line_total=Decimal('165.0000')
        )

        # Now change base price and variant price in catalog
        self.product.base_sales_price = Decimal('999.0000')
        self.product.save()
        self.variant.additional_price_adjustment = Decimal('500.0000')
        self.variant.save()

        # Reload invoice snapshot from database
        invoice.refresh_from_db()
        item.refresh_from_db()

        self.assertEqual(invoice.grand_total, Decimal('165.0000'))
        self.assertEqual(item.unit_price, Decimal('150.0000'))
        self.assertEqual(item.line_total, Decimal('165.0000'))

    # 4. Financial Precision and Banker's Rounding Test
    def test_bankers_rounding(self):
        """Verify Banker's rounding (ROUND_HALF_EVEN) per Part 6.1"""
        # In half-to-even:
        # 2.525 rounds to 2.52 (2 is even)
        # 2.535 rounds to 2.54 (4 is even)
        self.assertEqual(round_currency(Decimal('2.525')), Decimal('2.52'))
        self.assertEqual(round_currency(Decimal('2.535')), Decimal('2.54'))

    # 5. Payment Reconciliation Test
    def test_payment_reconciliation_multi_partial(self):
        """Verify partial payments settle invoice into PAID only upon full satisfaction (Part 4.2)"""
        invoice = Invoice.objects.create(
            invoice_number='INV-PAY-001',
            customer=self.customer,
            due_date=self.today,
            grand_total=Decimal('1000.0000'),
            outstanding_balance=Decimal('1000.0000'),
            status=Invoice.Status.CONFIRMED,
            is_frozen=True
        )

        # Partial payment 1: $400
        PaymentReconciliationService.record_and_reconcile(
            invoice_id=invoice.id,
            amount=Decimal('400.00'),
            payment_method='CREDIT_CARD'
        )
        invoice.refresh_from_db()
        self.assertEqual(invoice.status, Invoice.Status.CONFIRMED)
        self.assertEqual(invoice.amount_paid, Decimal('400.0000'))
        self.assertEqual(invoice.outstanding_balance, Decimal('600.0000'))

        # Partial payment 2: $600
        PaymentReconciliationService.record_and_reconcile(
            invoice_id=invoice.id,
            amount=Decimal('600.00'),
            payment_method='BANK_TRANSFER'
        )
        invoice.refresh_from_db()
        self.assertEqual(invoice.status, Invoice.Status.PAID)
        self.assertEqual(invoice.amount_paid, Decimal('1000.0000'))
        self.assertEqual(invoice.outstanding_balance, Decimal('0.0000'))

    # 6. Calendar Reminder Idempotency Test
    def test_calendar_reminder_idempotency(self):
        """Verify reminder scheduling is idempotent and prevents duplicate calendar entries (Part 7.1)"""
        # Create an overdue invoice
        Invoice.objects.create(
            invoice_number='INV-OVERDUE-01',
            customer=self.customer,
            invoice_date=self.today - timedelta(days=20),
            due_date=self.today - timedelta(days=5),
            grand_total=Decimal('500.0000'),
            outstanding_balance=Decimal('500.0000'),
            status=Invoice.Status.CONFIRMED
        )

        first_run = ReminderSchedulerService.schedule_overdue_collections()
        self.assertGreaterEqual(first_run, 1)

        # Second run immediately after must create 0 duplicates
        second_run = ReminderSchedulerService.schedule_overdue_collections()
        self.assertEqual(second_run, 0)

    # 7. Performance Benchmark Test
    def test_finance_dashboard_api_performance_benchmark(self):
        """Benchmark Finance Dashboard API response time (Target: under 2 seconds) per Part 8.2 & 17.7"""
        client = Client()
        client.force_login(self.admin)

        start_time = time.time()
        response = client.get('/api/finance/dashboard')
        elapsed_seconds = time.time() - start_time

        self.assertEqual(response.status_code, 200)
        self.assertLess(elapsed_seconds, 2.0, f"Dashboard API took {elapsed_seconds:.4f}s, exceeding 2.0s target!")
        print(f"\n[BENCHMARK] Finance Dashboard API response time: {elapsed_seconds * 1000:.2f}ms (Target: < 2000ms)")
