from rest_framework import serializers
from campuses.models import Campus, City, Neighborhood
from .neighborhood_serializer import NeighborhoodSerializer
from users.serializers import AgentSerializer
from .city_summary_serializer import CitySummarySerializer

class CampusSerializer(serializers.ModelSerializer):
    neighborhoods = NeighborhoodSerializer(many=True, read_only=True)
    agent = AgentSerializer(read_only=True)
    city = CitySummarySerializer(read_only=True)
    
    city_id = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.all(), 
        source="city",
        write_only=True 
    )
    neighborhood_ids = serializers.PrimaryKeyRelatedField(
        queryset=Neighborhood.objects.all(), 
        many=True,
        source="neighborhoods",
        write_only=True
    )

    # has_listings = serializers.SerializerMethodField()

    class Meta:
        model = Campus
        fields = [
            "id",
            "name",
            # "has_listings",
            "city",            # Read: Full object
            "city_id",         # Write: ID integer
            "neighborhoods",   # Read: List of objects
            "neighborhood_ids",# Write: List of integers
            "agent",
            "address",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    # def get_has_listings(self, obj):
    #     return obj.has_listings