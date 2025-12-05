from rest_framework import serializers
from billing.models import Subscription
from .tier_serializer import TierSerializer


class SubscriptionSerializer(serializers.ModelSerializer):
    tier_details = TierSerializer(source='tier', read_only=True)
    
    class Meta:
        model = Subscription
        fields = ['id', 'landlord', 'tier', 'tier_details', 'status', 'start_date', 'end_date', 'is_valid']
        read_only_fields = ['id', 'start_date', 'end_date', 'status']