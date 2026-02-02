from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for admin/staff to change a user's password by username.
    """
    username = serializers.CharField(required=True, help_text="Username of the user whose password will be changed")
    new_password = serializers.CharField(
        required=True, 
        write_only=True,
        min_length=8,
        help_text="New password for the user (minimum 8 characters)"
    )

    def validate(self, data):
        """
        Validate that the username exists and the password meets requirements.
        """
        username = data.get('username')
        new_password = data.get('new_password')

        # Check if user exists
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {"username": f"User with username '{username}' does not exist."}
            )
            
        return data
