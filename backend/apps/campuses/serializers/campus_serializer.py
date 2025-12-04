from rest_framework import serializers
from campuses.models import Campus, City
from .neighborhood_serializer import NeighborhoodSerializer
from .city_serializer import CitySerializer
from users.serializers import AgentSerializer

class CampusSerializer(serializers.ModelSerializer):
    neighborhoods = NeighborhoodSerializer(many=True, required=False)
    agent = AgentSerializer(read_only=True)
    city = CitySerializer(read_only=True)
    city_id = serializers.PrimaryKeyRelatedField(queryset=City.objects.all())
    
    class Meta:
        model = Campus
        fields = [
            "id",
            "name",
            "has_listings",
            "city",
            "city_id",
            "agent",
            "address",
            "created_at",
            "updated_at",
            "neighborhoods",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_has_listings(self, obj):
        return obj.has_listings




