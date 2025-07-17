from rest_framework import serializers
from django.contrib.auth import get_user_model
from users.models import Landlord

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "role",
        ]
        read_only_fields = ["id", "role"]  # optionally lock down role in general use


class LandlordProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Landlord
        fields = ["company_name", "phone_number", "address"]


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={"input_type": "password"})
    landlord_profile = LandlordProfileSerializer(required=False)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "landlord_profile",
            "role",
            "password",
        ]


    def create(self, validated_data):
        landlord_data = validated_data.pop("landlord_profile", None)
        password = validated_data.pop("password")
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()

        if landlord_data:
            Landlord.objects.create(user=user, **landlord_data)

        return user
