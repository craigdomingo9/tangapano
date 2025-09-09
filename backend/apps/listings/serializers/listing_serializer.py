from rest_framework import serializers
from listings.models import Listing, Amenity
from .room_serializer import RoomSerializer
from campuses.serializers import CampusSerializer
from campuses.models import Campus, Neighborhood
from .amenity_serializer import AmenitySerializer


class ListingSerializer(serializers.ModelSerializer):
    amenities = AmenitySerializer(many=True)
    rooms = RoomSerializer(many=True, read_only=True)
    campus = CampusSerializer(read_only=True)
    
    class Meta:
        model = Listing
        fields = [
            'id', 'landlord', 'title', 'description', 'images',
            'amenities',
            'campus', 'neighborhood',
            'apply_agent_fee', 'is_locked',
            'distance_from_campus', 'is_active', 'rooms',
            'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'created_at', 'updated_at')
        depth = 1


class ListingCreateSerializer(serializers.ModelSerializer):
    campus = serializers.PrimaryKeyRelatedField(queryset=Campus.objects.all(), required=False)
    neighborhood = serializers.PrimaryKeyRelatedField(queryset=Neighborhood.objects.all(), required=False)
    amenity_ids = serializers.PrimaryKeyRelatedField(
        queryset=Amenity.objects.all(),
        many=True,
        source='amenities',
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Listing
        fields = [
            'id', 'landlord', 'title', 'description', 'images',
            'amenity_ids',
            'campus', 'neighborhood',
            'apply_agent_fee', 'is_locked',
            'distance_from_campus', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'created_at', 'updated_at')
        depth = 1
