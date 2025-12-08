from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import transaction
from users.models import Agent
from campuses.models import Campus

User = get_user_model()

class AgentWriteSerializer(serializers.ModelSerializer):
    # ADD write_only=True to prevent the 'RelatedManager' error
    campus = serializers.PrimaryKeyRelatedField(
        queryset=Campus.objects.all(),
        write_only=True  
    )
    full_name = serializers.CharField(write_only=True)

    class Meta:
        model = Agent
        fields = [
            "id", "agency_name", "agent_fee", "phone_number", 
            "address", "campus", "full_name",
        ]
        read_only_fields = ["id"]

    def _split_name(self, full_name):
        parts = full_name.split()
        if not parts: return "", ""
        last_name = parts[-1] if len(parts) > 1 else ""
        first_name = " ".join(parts[:-1]) if len(parts) > 1 else parts[0]
        return first_name, last_name

    @transaction.atomic
    def create(self, validated_data):
        campus_instance = validated_data.pop("campus")
        full_name = validated_data.pop("full_name")

        # 1. Create User
        first_name, last_name = self._split_name(full_name)
        username = full_name.lower().replace(" ", "_")[:15]
        
        user = User.objects.create_user(
            username=username,
            password="tangapano",
            first_name=first_name,
            last_name=last_name
        )

        # 2. Create Agent
        agent = Agent.objects.create(user=user, **validated_data)

        # 3. Assign Agent to Campus
        campus_instance.agent = agent
        campus_instance.save(update_fields=['agent'])

        return agent

    @transaction.atomic
    def update(self, instance, validated_data):
        campus_instance = validated_data.pop("campus", None)
        full_name = validated_data.pop("full_name", None)

        # 1. Update User
        if full_name:
            instance.user.first_name, instance.user.last_name = self._split_name(full_name)
            instance.user.save()

        # 2. Update Agent
        instance = super().update(instance, validated_data)

        # 3. Update Campus Link
        if campus_instance:
            # A. Clear old campuses
            # Since 'agent.campus' is a manager, we use .update() to clear them all at once
            instance.campus.update(agent=None)

            # B. Set new campus
            campus_instance.agent = instance
            campus_instance.save(update_fields=['agent'])

        return instance