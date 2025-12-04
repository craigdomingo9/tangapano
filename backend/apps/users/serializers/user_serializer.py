from rest_framework import serializers
from django.contrib.auth import get_user_model
from users.models import Landlord, Agent
from .landlord_serializer import LandlordSerializer
from .agent_serializer import AgentSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    # Nest the full profile serializers for read operations
    landlord_profile = LandlordSerializer(required=False)
    agent_profile = AgentSerializer(required=False)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "role",
            "landlord_profile",
            "agent_profile",
        ]
        read_only_fields = ["id", "role"] # Usually username shouldn't change easily

    def update(self, instance, validated_data):
        # 1. Pop profile data
        landlord_data = validated_data.pop("landlord_profile", None)
        agent_data = validated_data.pop("agent_profile", None)

        # 2. Update User Standard Fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # 3. Update Landlord Profile (if exists and data provided)
        if landlord_data and hasattr(instance, 'landlord_profile'):
            for attr, value in landlord_data.items():
                setattr(instance.landlord_profile, attr, value)
            instance.landlord_profile.save()

        # 4. Update Agent Profile (if exists and data provided)
        if agent_data and hasattr(instance, 'agent_profile'):
            for attr, value in agent_data.items():
                setattr(instance.agent_profile, attr, value)
            instance.agent_profile.save()

        return instance

