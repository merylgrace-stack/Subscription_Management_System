from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from apps.api_views import (
    auth_login, auth_register, auth_invite_staff,
    CustomerViewSet, ProductViewSet, SubscriptionPlanViewSet, DiscountRuleViewSet, TaxRuleViewSet,
    QuotationViewSet, SubscriptionViewSet, InvoiceViewSet, PaymentViewSet,
    CalendarEventViewSet, NotificationViewSet, AuditLogViewSet,
    FinanceDashboardView, OverdueInvoicesView, CustomerPortalDashboardView,
    run_billing_cycle, stripe_webhook, invoice_pdf_view
)

router = DefaultRouter()
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'catalog/products', ProductViewSet, basename='product')
router.register(r'catalog/plans', SubscriptionPlanViewSet, basename='plan')
router.register(r'catalog/discounts', DiscountRuleViewSet, basename='discount')
router.register(r'catalog/taxes', TaxRuleViewSet, basename='tax')
router.register(r'quotations', QuotationViewSet, basename='quotation')
router.register(r'subscriptions', SubscriptionViewSet, basename='subscription')
router.register(r'invoices', InvoiceViewSet, basename='invoice')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'calendar/events', CalendarEventViewSet, basename='calendar')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'audit-logs', AuditLogViewSet, basename='audit')

urlpatterns = [
    path('admin/', admin.site.urls),

    # Authentication API
    path('api/auth/login', auth_login, name='auth_login'),
    path('api/auth/register', auth_register, name='auth_register'),
    path('api/auth/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/invite-staff', auth_invite_staff, name='auth_invite_staff'),

    # Billing Engine
    path('api/billing/run-cycle', run_billing_cycle, name='run_billing_cycle'),

    # Finance Cockpit
    path('api/finance/dashboard', FinanceDashboardView.as_view(), name='finance_dashboard'),
    path('api/finance/overdue-invoices', OverdueInvoicesView.as_view(), name='finance_overdue'),

    # Payment Gateway Webhook
    path('api/payments/webhook/stripe', stripe_webhook, name='stripe_webhook'),

    # Printable Invoice Document (PDF View)
    path('api/invoices/<int:pk>/pdf', invoice_pdf_view, name='invoice_pdf'),

    # Customer Portal (Isolated)
    path('api/customer/portal', CustomerPortalDashboardView.as_view(), name='customer_portal'),

    # ViewSet Router
    path('api/', include(router.urls)),
]
