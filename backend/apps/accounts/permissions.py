from rest_framework import permissions

class IsAdminRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.role == 'ADMIN' or request.user.is_superuser))

class IsStaffOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and
            request.user.role in ['ADMIN', 'STAFF', 'FINANCE']
        )

class IsFinanceOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and
            request.user.role in ['ADMIN', 'FINANCE']
        )

class IsCustomerOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        if request.user.role in ['ADMIN', 'STAFF', 'FINANCE']:
            return True
        # For customer role, ensure strict isolation
        if hasattr(obj, 'customer'):
            return obj.customer.id == getattr(request.user, 'customer_profile_id', None)
        if hasattr(obj, 'customer_profile'):
            return obj.customer_profile.id == getattr(request.user, 'customer_profile_id', None)
        return False
