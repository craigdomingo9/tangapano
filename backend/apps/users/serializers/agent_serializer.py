from rest_framework import serializers
from users.models import Agent

class AgentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = Agent
        fields = [
            "id",
            "user",
            "username",
            "full_name",
            "agency_name",
            "agent_fee",
            "phone_number",
            "address",
        ]
        read_only_fields = ["id", "user"]