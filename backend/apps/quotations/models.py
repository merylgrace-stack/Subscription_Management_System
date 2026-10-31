from django.db import models
from decimal import Decimal
from django.conf import settings

class QuotationTemplate(models.Model):
    name = models.CharField(max_length=255)
    default_plan = models.ForeignKey('catalog.SubscriptionPlan', on_delete=models.SET_NULL, null=True, blank=True)
    default_validity_days = models.PositiveIntegerField(default=30)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Quotation(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        SENT = 'SENT', 'Sent to Customer'
        APPROVED = 'APPROVED', 'Approved'
        REJECTED = 'REJECTED', 'Rejected'
        EXPIRED = 'EXPIRED', 'Expired'
        CONVERTED = 'CONVERTED', 'Converted to Subscription'

    quotation_number = models.CharField(max_length=64, unique=True, db_index=True)
    customer = models.ForeignKey('customers.Customer', on_delete=models.CASCADE, related_name='quotations')
    plan = models.ForeignKey('catalog.SubscriptionPlan', on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT, db_index=True)
    valid_until = models.DateField()
    subtotal = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))
    discount_amount = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))
    tax_amount = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))
    grand_total = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    converted_subscription = models.ForeignKey('subscriptions.Subscription', on_delete=models.SET_NULL, null=True, blank=True, related_name='originating_quotations')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.quotation_number} - {self.customer.company_name} ({self.status})"

class QuotationItem(models.Model):
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('catalog.Product', on_delete=models.PROTECT)
    variant = models.ForeignKey('catalog.ProductVariant', on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))
    variant_adjustment = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))
    discount_amount = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))
    tax_rate = models.DecimalField(max_digits=6, decimal_places=4, default=Decimal('0.0000'))
    tax_amount = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))
    line_total = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))

    def __str__(self):
        return f"{self.product.name} x {self.quantity} (${self.line_total})"
