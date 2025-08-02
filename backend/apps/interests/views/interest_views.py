from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser
from interests.serializers import InterestSerializer
from interests.models import Interest


# Create your views here.
class InterestsViewSet(viewsets.ModelViewSet):
    queryset = Interest.objects.all()
    serializer_class = InterestSerializer
    permission_classes = [AllowAny]
    
