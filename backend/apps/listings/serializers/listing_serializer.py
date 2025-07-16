from rest_framework import serializers
from listings.models import Listing
from .listing_amenity_serializer import ListingAmenitySerializer
from .room_serializer import RoomSerializer
from campuses.serializers import CampusSerializer


class ListingSerializer(serializers.ModelSerializer):
    amenities = ListingAmenitySerializer(many=True, read_only=True)
    rooms = RoomSerializer(many=True, read_only=True)
    campus = CampusSerializer(read_only=True)
    
    class Meta:
        model = Listing
        fields = ['id', 'landlord', 'title', 'description', 'images', 'amenities', 'rent_per_month', 'campus', 'neighborhood', 'distance_from_campus', 'is_active', 'rooms', 'created_at', 'updated_at']
        read_only_fields = ('id', 'created_at', 'updated_at')
        depth = 1

