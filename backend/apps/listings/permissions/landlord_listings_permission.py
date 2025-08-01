from rest_framework import permissions

class IsOwnerLandlord(permissions.BasePermission):
    """
    Allows access only to objects owned by the authenticated landlord user.
    """

    def has_object_permission(self, request, view, obj):
        return obj.landlord.user == request.user

class IsLandlordsImage(permissions.BasePermission):
    """
    Allows access only to objects owned by the authenticated landlord user.
    """

    def has_object_permission(self, request, view, obj):
        return obj.listing.landlord.user == request.user
