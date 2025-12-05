from rest_framework import viewsets, permissions
from billing.models import Tier
from billing.serializers import TierSerializer
from users.permissions import IsSuperAdmin

class TierViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Publicly list available pricing tiers.
    """
    queryset = Tier.objects.all()
    serializer_class = TierSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_permissions(self):
        # Allow anyone to see prices, but only Admins can edit them
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [permissions.AllowAny]
        else:
            self.permission_classes = [IsSuperAdmin]
        return super().get_permissions()