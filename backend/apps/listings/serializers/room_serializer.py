from rest_framework import serializers
from listings.models import Room

class RoomSerializer(serializers.ModelSerializer):
    is_full = serializers.SerializerMethodField()
    agent_fee = serializers.SerializerMethodField()
    room_number = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = ['id', 'room_number', 'listing', 'current_occupants', 'agent_fee', 'is_full', 'max_occupants', 'rent_per_month', 'gender_preference', 'is_active', 'created_at', 'updated_at']

    def get_is_full(self, obj):
        return obj.is_full

    def get_room_number(self, obj):
        return obj.room_number
    
    def get_agent_fee(self, obj):
        return obj.agent_fee

