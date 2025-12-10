from rest_framework import serializers
from listings.models import Listing


class ListingSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'description', 'landlord',
            'campus', 'neighborhood', 'amenities', 
            'rooms', 'distance_from_campus',
            'apply_agent_fee', 'is_active',
        ]


