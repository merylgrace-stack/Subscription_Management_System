from django.db import models
from decimal import Decimal

class Product(models.Model):
    class ProductType(models.TextChoices):
        SUBSCRIPTION = 'SUBSCRIPTION', 'Recurring Subscription'
        SERVICE = 'SERVICE', 'Professional Service'
        ADDON = 'ADDON', 'Addon Feature'

    name = models.CharField(max_length=255)
    product_type = models.CharField(max_length=30, choices=ProductType.choices, default=ProductType.SUBSCRIPTION)
    description = models.TextField(blank=True)
    base_sales_price = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))
    cost_price = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))
    is_active = models.BooleanField(default=True, db_index=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} (${self.base_sales_price})"

class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    name = models.CharField(max_length=255)
    additional_price_adjustment = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product.name} - {self.name} (+${self.additional_price_adjustment})"

    @property
    def final_unit_price(self):
        return self.product.base_sales_price + self.additional_price_adjustment

class SubscriptionPlan(models.Model):
    class BillingFrequency(models.TextChoices):
        DAILY = 'DAILY', 'Daily'
        WEEKLY = 'WEEKLY', 'Weekly'
        MONTHLY = 'MONTHLY', 'Monthly'
        YEARLY = 'YEARLY', 'Yearly'

    name = models.CharField(max_length=255)
    base_recurring_fee = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))
    billing_frequency = models.CharField(max_length=20, choices=BillingFrequency.choices, default=BillingFrequency.MONTHLY)
    minimum_purchase_quantity = models.PositiveIntegerField(default=1)
    validity_period_days = models.PositiveIntegerField(null=True, blank=True, help_text="Duration in days, or null for indefinite")
    auto_close_on_expiry = models.BooleanField(default=True)
    allow_early_cancellation = models.BooleanField(default=True)
    allow_pausing = models.BooleanField(default=True)
    allow_renewal = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.billing_frequency} - ${self.base_recurring_fee})"

class DiscountRule(models.Model):
    class DiscountType(models.TextChoices):
        PERCENTAGE = 'PERCENTAGE', 'Percentage Discount'
        FIXED = 'FIXED', 'Fixed Amount Discount'

    name = models.CharField(max_length=255)
    code = models.CharField(max_length=64, unique=True, db_index=True)
    discount_type = models.CharField(max_length=20, choices=DiscountType.choices, default=DiscountType.PERCENTAGE)
    value = models.DecimalField(max_digits=12, decimal_places=4, help_text="Percentage (e.g. 10.00) or Fixed currency amount")
    min_spend = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal('0.0000'))
    min_quantity = models.PositiveIntegerField(default=1)
    max_discount_amount = models.DecimalField(max_digits=12, decimal_places=4, null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    max_usage_count = models.PositiveIntegerField(null=True, blank=True)
    current_usage_count = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.code})"

class TaxRule(models.Model):
    class TaxType(models.TextChoices):
        SALES_TAX = 'SALES_TAX', 'Sales Tax'
        VAT = 'VAT', 'Value Added Tax (VAT)'
        GST = 'GST', 'Goods and Services Tax (GST)'

    name = models.CharField(max_length=255)
    tax_type = models.CharField(max_length=20, choices=TaxType.choices, default=TaxType.VAT)
    rate_percentage = models.DecimalField(max_digits=6, decimal_places=4, help_text="e.g. 18.0000 for 18%")
    country_code = models.CharField(max_length=10, default='GLOBAL')
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.rate_percentage}%)"
