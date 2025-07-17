from rest_framework import viewsets, permissions
from listings.serializers import RoomSerializer
from listings.models import Room


class RoomViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Room instances.
    """
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        # Custom logic before saving a new room can be added here
        serializer.save()

    def perform_update(self, serializer):
        # Custom logic before updating a room can be added here
        serializer.save()
