from rest_framework import viewsets, permissions
import rest_framework.exceptions as exceptions
from django_filters.rest_framework import DjangoFilterBackend
from listings.serializers import RoomSerializer
from listings.models import Room
from listings.permissions import IsRoomOwnedByLandlord
from listings.filters import RoomFilter

class RoomViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Room instances.
    """
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    filterset_class = RoomFilter
    filter_backends = [
        DjangoFilterBackend, 
    ]
    throttle_scope = "rooms"
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [permissions.IsAuthenticated, IsRoomOwnedByLandlord]
        else:
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()

    def perform_create(self, serializer):
        # Ensure the room is being added to a listing owned by the logged-in landlord
        listing = serializer.validated_data.get("listing")
        if listing.landlord.user != self.request.user:
            raise exceptions.PermissionDenied("You cannot add a room to a listing you do not own.")
        serializer.save()
