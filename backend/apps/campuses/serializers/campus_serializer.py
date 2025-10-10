from rest_framework import serializers
from campuses.models import Campus
from campuses.serializers.neighborhood_serializer import NeighborhoodSerializer
from users.serializers import AgentSerializer


class CampusSerializer(serializers.ModelSerializer):
    neighborhoods = NeighborhoodSerializer(many=True, required=False)
    agent = AgentSerializer(read_only=True)
    
    class Meta:
        model = Campus
        fields = [
            "id",
            "name",
            "has_listings",
            "city",
            "agent",
            "address",
            "created_at",
            "updated_at",
            "neighborhoods",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_has_listings(self, obj):
        return obj.has_listings




