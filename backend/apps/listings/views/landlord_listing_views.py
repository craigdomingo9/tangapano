from rest_framework import viewsets, permissions
from listings.models import Listing
from listings.serializers import ListingSerializer, ListingCreateSerializer
from listings.permissions import IsOwnerLandlord

class LandlordListingViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOwnerLandlord]
    throttle_scope = "dashboard_listings"

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ListingCreateSerializer
        return ListingSerializer

    def get_queryset(self):
        # Return empty list if user is not a landlord
        if not hasattr(self.request.user, 'landlord_profile'):
            return Listing.objects.none()
        return Listing.objects.filter(landlord=self.request.user.landlord_profile)

    def perform_create(self, serializer):
        serializer.save(landlord=self.request.user.landlord_profile)