from rest_framework import serializers
from django.contrib.auth import get_user_model

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


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={"input_type": "password"})
    confirm_password = serializers.CharField(write_only=True, required=True, style={"input_type": "password"})

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "role",
            "password",
            "confirm_password",
        ]

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        user = User.objects.create_user(**validated_data)
        return user
