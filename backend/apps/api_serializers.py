from rest_framework import serializers
from django.contrib.auth import get_user_model
from apps.customers.models import Customer
from apps.catalog.models import Product, ProductVariant, SubscriptionPlan, DiscountRule, TaxRule
from apps.quotations.models import Quotation, QuotationItem, QuotationTemplate
from apps.subscriptions.models import Subscription, SubscriptionItem
from apps.billing.models import Invoice, InvoiceItem
from apps.payments.models import Payment
from apps.calendar_events.models import CalendarEvent
from apps.notifications.models import Notification
from apps.audit.models import AuditLog
from apps.support.models import SupportRequest

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'customer_profile', 'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined']

class CustomerSerializer(serializers.ModelSerializer):
    customer_code = serializers.CharField(required=False, allow_blank=True)
    active_subscriptions_count = serializers.SerializerMethodField()
    outstanding_balance = serializers.SerializerMethodField()

    class Meta:
        model = Customer
        fields = '__all__'

    def create(self, validated_data):
        if not validated_data.get('customer_code'):
            import uuid
            validated_data['customer_code'] = f"CUST-{uuid.uuid4().hex[:6].upper()}"
        return super().create(validated_data)

    def get_active_subscriptions_count(self, obj):
        return obj.subscriptions.filter(status='ACTIVE').count()

    def get_outstanding_balance(self, obj):
        from django.db.models import Sum
        total = obj.invoices.filter(status='CONFIRMED').aggregate(total=Sum('outstanding_balance'))['total']
        return str(total or '0.00')

class ProductVariantSerializer(serializers.ModelSerializer):
    final_unit_price = serializers.ReadOnlyField()

    class Meta:
        model = ProductVariant
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = '__all__'

class DiscountRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiscountRule
        fields = '__all__'

class TaxRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxRule
        fields = '__all__'

class QuotationItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = QuotationItem
        fields = '__all__'

class QuotationSerializer(serializers.ModelSerializer):
    items = QuotationItemSerializer(many=True, read_only=True)
    customer_name = serializers.ReadOnlyField(source='customer.company_name')

    class Meta:
        model = Quotation
        fields = '__all__'

class SubscriptionItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = SubscriptionItem
        fields = '__all__'

class SubscriptionSerializer(serializers.ModelSerializer):
    items = SubscriptionItemSerializer(many=True, read_only=True)
    customer_name = serializers.ReadOnlyField(source='customer.company_name')
    plan_name = serializers.ReadOnlyField(source='plan.name')

    class Meta:
        model = Subscription
        fields = '__all__'

class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = '__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, read_only=True)
    customer_name = serializers.ReadOnlyField(source='customer.company_name')
    is_overdue = serializers.ReadOnlyField()

    class Meta:
        model = Invoice
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.company_name')
    invoice_number = serializers.ReadOnlyField(source='invoice.invoice_number')

    class Meta:
        model = Payment
        fields = '__all__'

class CalendarEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarEvent
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class AuditLogSerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = AuditLog
        fields = '__all__'

class SupportRequestSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.company_name')

    class Meta:
        model = SupportRequest
        fields = '__all__'
