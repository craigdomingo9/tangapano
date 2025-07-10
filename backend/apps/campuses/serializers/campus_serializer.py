from rest_framework import serializers
from campuses.models import Campus, Neighborhood
from campuses.serializers.neighborhood_serializer import NeighborhoodSerializer


class CampusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campus
        fields = [
            "id",
            "name",
            "city",
            "agents",
            "address",
            "created_at",
            "updated_at",
            "neighborhoods",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
        depth = 1




