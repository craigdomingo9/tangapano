from rest_framework import permissions

class IsRoomOwnedByLandlord(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if not hasattr(request.user, 'landlord_profile'):
            return False
        return obj.listing.landlord.user == request.user