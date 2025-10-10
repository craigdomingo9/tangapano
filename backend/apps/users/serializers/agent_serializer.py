from rest_framework import serializers
from users.models import Agent


class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = [
            "id",
            "user",
            "agency_name",
            "agent_fee",
            "phone_number",
            "address",
        ]
        