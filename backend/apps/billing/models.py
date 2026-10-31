from django.db import models
from decimal import Decimal
from django.utils import timezone

class Invoice(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        CONFIRMED = 'CONFIRMED', 'Confirmed'
        PAID = 'PAID', 'Paid'
        CANCELLED = 'CANCELLED', 'Cancelled'

    invoice_number = models.CharField(max_length=64, unique=True, db_index=True)
    customer = models.ForeignKey('customers.Customer', on_delete=models.CASCADE, related_name='invoices')
    subscription = models.ForeignKey('subscriptions.Subscription', on_delete=models.SET_NULL, null=True, blank=True, related_name='invoices')
    billing_period_start = models.DateField(null=True, blank=True)
    billing_period_end = models.DateField(null=True, blank=True)
    invoice_date = models.DateField(default=timezone.now)
    due_date = models.DateField(db_index=True)
    
    # Financial fields with Decimal(12,4) precision
    subtotal = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))
    discount_total = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))
    tax_total = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))
    grand_total = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))
    amount_paid = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))
    outstanding_balance = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT, db_index=True)
    is_frozen = models.BooleanField(default=False, help_text="Locked immutable snapshot once CONFIRMED or PAID")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        # Part 5.1 Enforce UNIQUE(subscription_id, billing_period_start, billing_period_end)
        constraints = [
            models.UniqueConstraint(
                fields=['subscription', 'billing_period_start', 'billing_period_end'],
                name='unique_subscription_billing_period',
                condition=models.Q(subscription__isnull=False)
            )
        ]

    def __str__(self):
        return f"{self.invoice_number} - {self.customer.company_name} (${self.grand_total}) [{self.status}]"

    @property
    def is_overdue(self):
        """Calculated receivables condition per Part 4.2"""
        if self.status == self.Status.CONFIRMED and self.outstanding_balance > 0:
            return self.due_date < timezone.now().date()
        return False

    def clean(self):
        # Database immutability validation per Part 6.2
        if self.pk and self.is_frozen:
            orig = Invoice.objects.get(pk=self.pk)
            # If already confirmed or paid, forbid changing financial fields directly
            if orig.status in [self.Status.CONFIRMED, self.Status.PAID]:
                if self.grand_total != orig.grand_total or self.subtotal != orig.subtotal:
                    raise ValueError("Cannot modify financial fields of a confirmed or paid invoice snapshot.")

class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    original_product = models.ForeignKey('catalog.Product', on_delete=models.SET_NULL, null=True, blank=True)
    # Frozen snapshot fields to protect historical integrity
    product_name = models.CharField(max_length=255)
    variant_name = models.CharField(max_length=255, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))
    discount_amount = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))
    tax_rate = models.DecimalField(max_digits=6, decimal_places=4, default=Decimal('0.0000'))
    tax_amount = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))
    line_total = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))

    def __str__(self):
        return f"{self.product_name} x {self.quantity} (${self.line_total})"
