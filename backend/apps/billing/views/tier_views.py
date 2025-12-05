from rest_framework import viewsets, permissions
from billing.models import Tier
from billing.serializers import TierSerializer

class TierViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Publicly list available pricing tiers.
    """
    queryset = Tier.objects.all()
    serializer_class = TierSerializer
    permission_classes = [permissions.AllowAny]