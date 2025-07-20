from rest_framework import serializers
from listings.models import Room

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'listing', 'max_occupants', 'rent_per_month', 'gender_preference', 'is_available', 'is_active', 'created_at', 'updated_at']
