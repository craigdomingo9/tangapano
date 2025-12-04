from rest_framework import permissions

class IsOwnerLandlord(permissions.BasePermission):
    """
    Allows access only to objects owned by the authenticated landlord user.
    """
    def has_object_permission(self, request, view, obj):
        # Safety check: Ensure request.user has a landlord profile
        if not hasattr(request.user, 'landlord_profile'):
            return False
        return obj.landlord.user == request.user

class IsLandlordsImage(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if not hasattr(request.user, 'landlord_profile'):
            return False
        return obj.listing.landlord.user == request.user