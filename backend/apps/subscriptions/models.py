from django.db import models
from decimal import Decimal

class Subscription(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        QUOTATION = 'QUOTATION', 'Quotation'
        CONFIRMED = 'CONFIRMED', 'Confirmed'
        ACTIVE = 'ACTIVE', 'Active'
        PAUSED = 'PAUSED', 'Paused'
        CLOSED = 'CLOSED', 'Closed'

    subscription_code = models.CharField(max_length=64, unique=True, db_index=True)
    customer = models.ForeignKey('customers.Customer', on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey('catalog.SubscriptionPlan', on_delete=models.PROTECT, related_name='subscriptions')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT, db_index=True)
    start_date = models.DateField()
    expiry_date = models.DateField(null=True, blank=True)
    next_billing_date = models.DateField(db_index=True)
    billing_frequency = models.CharField(max_length=20, choices=[
        ('DAILY', 'Daily'),
        ('WEEKLY', 'Weekly'),
        ('MONTHLY', 'Monthly'),
        ('YEARLY', 'Yearly'),
    ], default='MONTHLY')
    payment_terms = models.CharField(max_length=50, default='NET 30')
    total_recurring_amount = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))
    auto_renew = models.BooleanField(default=True)
    pause_reason = models.TextField(blank=True)
    cancellation_reason = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.subscription_code} - {self.customer.company_name} ({self.status})"

class SubscriptionItem(models.Model):
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('catalog.Product', on_delete=models.PROTECT)
    variant = models.ForeignKey('catalog.ProductVariant', on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))
    variant_adjustment = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))
    discount_amount = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))
    tax_rate = models.DecimalField(max_digits=6, decimal_places=4, default=Decimal('0.0000'))
    line_total = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))

    def __str__(self):
        return f"{self.product.name} x {self.quantity} (${self.line_total})"
