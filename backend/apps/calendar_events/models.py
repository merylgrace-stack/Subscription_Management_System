from django.db import models
from django.conf import settings

class CalendarEvent(models.Model):
    class EventType(models.TextChoices):
        RENEWAL_REMINDER = 'RENEWAL_REMINDER', 'Renewal Reminder'
        PAYMENT_DUE = 'PAYMENT_DUE', 'Payment Due / Overdue Follow-up'
        QUOTE_EXPIRATION = 'QUOTE_EXPIRATION', 'Quotation Expiration Warning'
        INTERNAL_TASK = 'INTERNAL_TASK', 'Internal Staff Task'
        COMPANY_EVENT = 'COMPANY_EVENT', 'Company Milestone'

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        ACKNOWLEDGED = 'ACKNOWLEDGED', 'Acknowledged'
        COMPLETED = 'COMPLETED', 'Completed'
        DISMISSED = 'DISMISSED', 'Dismissed'

    event_type = models.CharField(max_length=30, choices=EventType.choices, default=EventType.INTERNAL_TASK, db_index=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    event_date = models.DateField(db_index=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING, db_index=True)
    
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    related_customer = models.ForeignKey('customers.Customer', on_delete=models.CASCADE, null=True, blank=True)
    related_subscription = models.ForeignKey('subscriptions.Subscription', on_delete=models.CASCADE, null=True, blank=True)
    related_quotation = models.ForeignKey('quotations.Quotation', on_delete=models.CASCADE, null=True, blank=True)
    related_invoice = models.ForeignKey('billing.Invoice', on_delete=models.CASCADE, null=True, blank=True)
    
    # Idempotent key to prevent duplicate automatic reminders per Part 7.1
    idempotent_key = models.CharField(max_length=128, unique=True, null=True, blank=True, db_index=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'calendar_events'
        ordering = ['event_date', '-created_at']

    def __str__(self):
        return f"[{self.event_type}] {self.title} on {self.event_date} ({self.status})"
