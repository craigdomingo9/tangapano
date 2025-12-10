from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny

from listings.models import Category
from listings.serializers import AmenityCategorySerializer
from users.permissions import IsSuperAdmin


class AmenityCategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = AmenityCategorySerializer
    permission_classes = [AllowAny,]
    
    
    def get_permissions(self):
        if self.action in ["create", "update", "destroy", "partial_update"]:
            self.permission_classes = [IsSuperAdmin]
        else:
            self.permission_classes = [AllowAny]
        return super().get_permissions()


