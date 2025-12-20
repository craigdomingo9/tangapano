from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import transaction
from users.models import Landlord, Agent

from notifications.utils.action_utils import log_and_notify_notable_action

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={"input_type": "password"})
    
    # specialized profile data
    company_name = serializers.CharField(required=False, write_only=True)
    agency_name = serializers.CharField(required=False, write_only=True)
    phone_number = serializers.CharField(required=False, write_only=True)

    class Meta:
        model = User
        fields = [
            "username", "email", "first_name", "last_name", 
            "role", "password", 
            "company_name", "agency_name", "phone_number"
        ]

    def validate(self, data):
        """Ensure correct fields are present for the selected role."""
        role = data.get('role')
        if role == 'landlord' and not data.get('phone_number'):
             raise serializers.ValidationError({"phone_number": "Phone number is required for landlords."})
        return data

    def create(self, validated_data):
        # Extract profile specific data
        profile_data = {
            'company_name': validated_data.pop("company_name", None),
            'agency_name': validated_data.pop("agency_name", None),
            'phone_number': validated_data.pop("phone_number", None),
        }
        
        password = validated_data.pop("password")
        
        with transaction.atomic():
            # 1. Create User
            user = User.objects.create_user(**validated_data)
            user.set_password(password)
            user.save()

            # 2. Create Profile based on Role
            if user.role == 'landlord':
                account_type = 'agency' if profile_data.get('company_name') else 'individual'
                Landlord.objects.create(
                    user=user,
                    phone_number=profile_data.get('phone_number'),
                    company_name=profile_data.get('company_name'),
                    account_type=account_type
                )
            elif user.role == 'agent':
                Agent.objects.create(
                    user=user,
                    phone_number=profile_data.get('phone_number'),
                    agency_name=profile_data.get('agency_name')
                )
            
            # 3. Log and Notify
            log_and_notify_notable_action(
                action_type='user_registered',
                description=f"New user registered: {user.username} ({user.get_role_display()})",
                actor=user,
                metadata={'user_id': user.id, 'role': user.role}
            )

        return user

