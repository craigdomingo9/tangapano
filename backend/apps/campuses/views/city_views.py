from rest_framework.viewsets import ModelViewSet

from campuses.models import City
from campuses.serializers import CitySerializer
from users.permissions import IsSuperAdmin
from notifications.utils.action_utils import log_and_notify_notable_action


class CityViewSet(ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = [IsSuperAdmin,]

    def perform_create(self, serializer):
        city = serializer.save()
        log_and_notify_notable_action(
            action_type='city_created',
            description=f"Admin {self.request.user.username} created city '{city.name}'",
            actor=self.request.user,
            metadata={'city_id': city.id, 'name': city.name}
        )

    def perform_update(self, serializer):
        city = serializer.save()
        log_and_notify_notable_action(
            action_type='city_updated',
            description=f"Admin {self.request.user.username} updated city '{city.name}'",
            actor=self.request.user,
            metadata={'city_id': city.id, 'name': city.name}
        )



