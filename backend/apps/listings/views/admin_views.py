from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from listings.models import Listing
from listings.serializers import ListingAdminSerializer
from users.permissions.admin_permissions import IsSuperAdmin
from notifications.models import Notification
from listings.filters import ListingAdminFilter


class AdminListingViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Admin-only viewset to moderate listings.
    """
    queryset = Listing.objects.all()
    serializer_class = ListingAdminSerializer
    permission_classes = [IsSuperAdmin]
    filterset_class = ListingAdminFilter
    filter_backends = [
        DjangoFilterBackend, 
    ]
    
    def get_queryset(self):
        return super().get_queryset().prefetch_related('rooms')

    @action(detail=True, methods=['post'])
    def lock(self, request, pk=None):
        """
        POST /api/admin/listings/{id}/lock/
        Locks the listing (hides from search) and alerts owner.
        """
        listing = self.get_object()
        listing.is_locked = True
        listing.save() 
        # Note: django-elasticsearch-dsl signals will automatically 
        # update the index to reflect 'is_locked=True'.

        # Notify Landlord
        Notification.objects.create(
            recipient=listing.landlord.user,
            title="Listing Locked",
            message=f"Your listing '{listing.title}' has been locked by an admin due to policy violations.",
            notification_type="warning",
            category="listing",
            action_link=f"/dashboard/listings/{listing.id}"
        )

        return Response({'status': 'locked'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def unlock(self, request, pk=None):
        listing = self.get_object()
        listing.is_locked = False
        listing.save()

        Notification.objects.create(
            recipient=listing.landlord.user,
            title="Listing Unlocked",
            message=f"Your listing '{listing.title}' has been restored.",
            notification_type="success",
            category="listing"
        )

        return Response({'status': 'unlocked'}, status=status.HTTP_200_OK)