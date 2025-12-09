from rest_framework.viewsets import ModelViewSet

from campuses.models import City
from campuses.serializers import CitySerializer
from users.permissions import IsSuperAdmin


class CityViewSet(ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = [IsSuperAdmin,]


