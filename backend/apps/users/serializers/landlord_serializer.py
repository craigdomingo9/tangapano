from users.models import Landlord
from rest_framework import serializers


class LandlordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Landlord
        fields = [
            "id",
            "user",
            "company_name",
            "phone_number",
            "address",
        ]
        read_only_fields = ["id"]

