from rest_framework import serializers
from campuses.models import Neighborhood


class NeighborhoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Neighborhood
        fields = [
            "id",
            "name",
            "city",
        ]
        read_only_fields = ["id"]
