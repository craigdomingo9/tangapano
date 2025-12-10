from rest_framework import serializers
from campuses.models import Neighborhood, City
from .city_summary_serializer import CitySummarySerializer


class NeighborhoodSerializer(serializers.ModelSerializer):
    city = CitySummarySerializer(read_only=True)
    city_id = serializers.PrimaryKeyRelatedField(queryset=City.objects.all(), source="city")
    
    
    class Meta:
        model = Neighborhood
        fields = [
            "id",
            "name",
            "city",
            "city_id",
            "has_listings",
        ]
        read_only_fields = ["id"]
    
    def get_has_listings(self, obj):
        return obj.has_listings
