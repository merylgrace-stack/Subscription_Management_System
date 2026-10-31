from datetime import timedelta
from django.utils import timezone
from apps.calendar_events.models import CalendarEvent
from apps.quotations.models import Quotation
from apps.subscriptions.models import Subscription
from apps.billing.models import Invoice

class ReminderSchedulerService:
    """
    Automated idempotent calendar reminder service per Part 7.1.
    """

    @classmethod
    def schedule_quotation_expirations(cls):
        """Schedules reminder 2 days before quotation expiry"""
        today = timezone.now().date()
        target_date = today + timedelta(days=2)

        expiring_quotes = Quotation.objects.filter(
            status__in=[Quotation.Status.SENT, Quotation.Status.DRAFT],
            valid_until=target_date
        )

        created_count = 0
        for quote in expiring_quotes:
            key = f"QUOTE_EXPIRY_{quote.id}_{quote.valid_until}"
            obj, created = CalendarEvent.objects.get_or_create(
                idempotent_key=key,
                defaults={
                    'event_type': CalendarEvent.EventType.QUOTE_EXPIRATION,
                    'title': f"Quotation {quote.quotation_number} expiring in 2 days",
                    'description': f"Quotation for {quote.customer.company_name} of ${quote.grand_total} expires on {quote.valid_until}.",
                    'event_date': today,
                    'related_customer': quote.customer,
                    'related_quotation': quote,
                    'status': CalendarEvent.Status.PENDING,
                }
            )
            if created:
                created_count += 1
        return created_count

    @classmethod
    def schedule_subscription_renewals(cls):
        """Schedules renewal review 7 days before subscription renewal"""
        today = timezone.now().date()
        target_date = today + timedelta(days=7)

        upcoming_renewals = Subscription.objects.filter(
            status=Subscription.Status.ACTIVE,
            next_billing_date=target_date
        )

        created_count = 0
        for sub in upcoming_renewals:
            key = f"SUB_RENEWAL_{sub.id}_{sub.next_billing_date}"
            obj, created = CalendarEvent.objects.get_or_create(
                idempotent_key=key,
                defaults={
                    'event_type': CalendarEvent.EventType.RENEWAL_REMINDER,
                    'title': f"Subscription {sub.subscription_code} renewal in 7 days",
                    'description': f"Review contract & renewal terms for {sub.customer.company_name} (${sub.total_recurring_amount}).",
                    'event_date': today,
                    'related_customer': sub.customer,
                    'related_subscription': sub,
                    'status': CalendarEvent.Status.PENDING,
                }
            )
            if created:
                created_count += 1
        return created_count

    @classmethod
    def schedule_overdue_collections(cls):
        """Identifies overdue invoices and creates collections follow-up events"""
        today = timezone.now().date()

        overdue_invoices = Invoice.objects.filter(
            status=Invoice.Status.CONFIRMED,
            due_date__lt=today,
            outstanding_balance__gt=0
        )

        created_count = 0
        for inv in overdue_invoices:
            key = f"OVERDUE_COLLECTION_{inv.id}_{inv.due_date}"
            obj, created = CalendarEvent.objects.get_or_create(
                idempotent_key=key,
                defaults={
                    'event_type': CalendarEvent.EventType.PAYMENT_DUE,
                    'title': f"Collections Follow-up: Invoice {inv.invoice_number}",
                    'description': f"Invoice of ${inv.outstanding_balance} for {inv.customer.company_name} is overdue since {inv.due_date}.",
                    'event_date': today,
                    'related_customer': inv.customer,
                    'related_invoice': inv,
                    'status': CalendarEvent.Status.PENDING,
                }
            )
            if created:
                created_count += 1
        return created_count

    @classmethod
    def run_all(cls):
        q = cls.schedule_quotation_expirations()
        s = cls.schedule_subscription_renewals()
        c = cls.schedule_overdue_collections()
        return {'quotation_reminders': q, 'renewal_reminders': s, 'collections_reminders': c}
