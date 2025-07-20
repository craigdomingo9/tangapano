from rest_framework import permissions

class IsRoomOwnedByLandlord(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an room to edit it.
    """
    def has_object_permission(self, request, view, obj):
        return obj.listing.landlord.user == request.user
