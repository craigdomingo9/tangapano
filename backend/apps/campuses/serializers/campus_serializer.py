from rest_framework import serializers
from campuses.models import Campus, City, Neighborhood
from .neighborhood_serializer import NeighborhoodSerializer
from users.serializers import AgentSerializer
from .city_summary_serializer import CitySummarySerializer

# --- 1. READ (BASE) SERIALIZER ---
class CampusSerializer(serializers.ModelSerializer):
    """
    Used for GET requests. 
    Returns full nested objects (City name, Agent details, etc.) for display.
    """
    neighborhoods = NeighborhoodSerializer(many=True, read_only=True)
    agent = AgentSerializer(read_only=True)
    city = CitySummarySerializer(read_only=True)

    class Meta:
        model = Campus
        fields = [
            "id",
            "name",
            "city",
            "neighborhoods",
            "agent",
            "latitude",
            "longitude",
            "address",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


# --- 2. WRITE (CREATE/UPDATE) SERIALIZER ---
class CampusCreateSerializer(serializers.ModelSerializer):
    """
    Used for POST/PUT requests.
    Accepts IDs for relationships instead of full objects.
    """
    # We reuse the field names 'city' and 'neighborhoods' but define them as PK fields.
    # This means the frontend sends { "city": 1, "neighborhoods": [5, 8] }
    city_id = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.all(),
        required=True,
        source="city",
    )
    neighborhood_ids = serializers.PrimaryKeyRelatedField(
        queryset=Neighborhood.objects.all(), 
        many=True,
        required=False,
        source="neighborhoods",
    )

    class Meta:
        model = Campus
        fields = [
            "id",
            "name",
            "city_id",
            "neighborhood_ids",
            "latitude",
            "longitude",
        ]

    def to_representation(self, instance):
        return CampusSerializer(instance, context=self.context).data