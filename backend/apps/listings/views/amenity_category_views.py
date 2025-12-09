from rest_framework.viewsets import ModelViewSet

from listings.models import Category
from listings.serializers import AmenityCategorySerializer
from users.permissions import IsSuperAdmin


class AmenityCategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = AmenityCategorySerializer
    permission_classes = [IsSuperAdmin,]


