from rest_framework import generics, permissions
from users.serializers import LandlordSerializer
from users.models import Landlord
from users.permissions import IsOwnerLandlord


class LandlordRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Landlord.objects.all()
    serializer_class = LandlordSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerLandlord]
    
    def get_object(self):
        return Landlord.objects.get(user=self.request.user)

