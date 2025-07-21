from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from listings.models import Listing
from users.models import Landlord
from listings.serializers import ListingSerializer, ListingCreateSerializer
from listings.permissions import IsOwnerLandlord


class LandlordListingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for landlords to manage only their own listings.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerLandlord]
    
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ListingCreateSerializer
        return ListingSerializer

    def get_queryset(self):
        # Ensure landlord exists for this user
        user = self.request.user
        
        return Listing.objects.filter(landlord__user=user)

    def perform_create(self, serializer):
        # Auto-assign the listing to the logged-in landlord
        serializer.save(landlord=Landlord.objects.get(user=self.request.user))


