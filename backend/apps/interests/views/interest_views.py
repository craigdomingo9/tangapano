from rest_framework import viewsets, permissions
from interests.models import Interest
from interests.serializers import InterestSerializer

class InterestsViewSet(viewsets.ModelViewSet):
    """
    Handles student inquiries. 
    Open to public (AllowAny) so students can inquire without signing up.
    """
    queryset = Interest.objects.all()
    serializer_class = InterestSerializer
    permission_classes = [permissions.AllowAny]
    throttle_scope = "inquiries" # Good practice to rate-limit this