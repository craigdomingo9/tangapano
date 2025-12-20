from rest_framework import generics, permissions
from users.serializers.landlord_serializer import LandlordSerializer
from users.models import Landlord
from users.permissions.landlord_permissions import IsOwnerLandlord

from notifications.utils.action_utils import log_and_notify_notable_action

class LandlordRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = LandlordSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerLandlord]
    
    def get_queryset(self):
        # Optimization: Select related user to avoid N+1 queries 
        # when serializing the 'username' field in the serializer
        return Landlord.objects.select_related('user')

    def get_object(self):
        return self.get_queryset().get(user=self.request.user)

    def perform_update(self, serializer):
        landlord = serializer.save()
        log_and_notify_notable_action(
            action_type='landlord_updated',
            description=f"Landlord {landlord.user.username} updated their profile",
            actor=landlord.user,
            metadata={'landlord_id': landlord.id}
        )

