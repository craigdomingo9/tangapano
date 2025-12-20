from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password']
        extra_kwargs = {
            'username': {'validators': []},
            'email': {'validators': []},
            'password': {'write_only': True, 'required': False}
        }
