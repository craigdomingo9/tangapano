from rest_framework import serializers
from users.models import Landlord

class LandlordSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = Landlord
        fields = [
            "id",
            "user",
            "username",
            "full_name",
            "account_type",
            "company_name",
            "is_verified",
            "phone_number",
            "address",
        ]
        read_only_fields = ["id", "user"]