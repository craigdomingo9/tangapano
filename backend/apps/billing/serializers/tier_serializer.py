from rest_framework import serializers
from billing.models import Tier

class TierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tier
        fields = '__all__'
