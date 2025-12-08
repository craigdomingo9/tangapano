from rest_framework import serializers
from users.models import Agent

class AgentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    total_listings = serializers.IntegerField(read_only=True)
    campus_name = serializers.CharField(read_only=True)
    campus_id = serializers.CharField(read_only=True)
    
    class Meta:
        model = Agent
        fields = [
            "id",
            "user",
            "username",
            "full_name",
            "agency_name",
            "campus_name",
            "campus_id",
            "agent_fee",
            "phone_number",
            "total_listings",
            "address",
        ]
        read_only_fields = ["id", "user"]