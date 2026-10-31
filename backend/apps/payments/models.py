from django.db import models
from decimal import Decimal
from django.utils import timezone
from django.conf import settings

class Payment(models.Model):
    class Status(models.TextChoices):
        SUCCESS = 'SUCCESS', 'Successful'
        FAILED = 'FAILED', 'Failed'
        PENDING = 'PENDING', 'Pending'
        REFUNDED = 'REFUNDED', 'Refunded'

    class Method(models.TextChoices):
        CREDIT_CARD = 'CREDIT_CARD', 'Credit Card'
        BANK_TRANSFER = 'BANK_TRANSFER', 'Bank Wire / ACH'
        STRIPE = 'STRIPE', 'Stripe Gateway'
        CHECK = 'CHECK', 'Corporate Check'
        MANUAL = 'MANUAL', 'Manual Ledger Entry'

    transaction_id = models.CharField(max_length=64, unique=True, db_index=True)
    customer = models.ForeignKey('customers.Customer', on_delete=models.CASCADE, related_name='payments')
    invoice = models.ForeignKey('billing.Invoice', on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))
    payment_method = models.CharField(max_length=30, choices=Method.choices, default=Method.CREDIT_CARD)
    payment_status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING, db_index=True)
    transaction_date = models.DateTimeField(default=timezone.now)
    is_reconciled = models.BooleanField(default=False, db_index=True)
    reconciled_at = models.DateTimeField(null=True, blank=True)
    reconciled_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-transaction_date']

    def __str__(self):
        return f"{self.transaction_id} - ${self.amount} for {self.invoice.invoice_number} ({self.payment_status})"
