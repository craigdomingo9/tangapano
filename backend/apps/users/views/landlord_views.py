from rest_framework import generics, permissions
from users.serializers.landlord_serializer import LandlordSerializer
from users.models import Landlord
from users.permissions.landlord_permissions import IsOwnerLandlord

class LandlordRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = LandlordSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerLandlord]
    
    def get_queryset(self):
        # Optimization: Select related user to avoid N+1 queries 
        # when serializing the 'username' field in the serializer
        return Landlord.objects.select_related('user')

    def get_object(self):
        return self.get_queryset().get(user=self.request.user)
