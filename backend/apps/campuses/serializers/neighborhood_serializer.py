from rest_framework import serializers
from campuses.models import Neighborhood


class NeighborhoodSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Neighborhood
        fields = [
            "id",
            "name",
            "city",
            "has_listings",
        ]
        read_only_fields = ["id"]
    
    def get_has_listings(self, obj):
        return obj.has_listings
