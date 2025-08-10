from rest_framework import serializers
from listings.models import Room

class RoomSerializer(serializers.ModelSerializer):
    is_full = serializers.SerializerMethodField()
    class Meta:
        model = Room
        fields = ['id', 'listing', 'current_occupants', 'is_full', 'max_occupants', 'rent_per_month', 'gender_preference', 'is_available', 'is_active', 'created_at', 'updated_at']

    def get_is_full(self, obj):
        return obj.is_full
