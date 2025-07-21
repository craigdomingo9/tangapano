from rest_framework import serializers
from listings.models import Listing, Amenity, ListingAmenity
from .listing_amenity_serializer import ListingAmenitySerializer
from .room_serializer import RoomSerializer
from campuses.serializers import CampusSerializer
from campuses.models import Campus, Neighborhood


class ListingSerializer(serializers.ModelSerializer):
    amenities = ListingAmenitySerializer(many=True)
    rooms = RoomSerializer(many=True, read_only=True)
    campus = CampusSerializer(read_only=True)
    
    class Meta:
        model = Listing
        fields = ['id', 'landlord', 'title', 'description', 'images', 'amenities', 'campus', 'neighborhood', 'distance_from_campus', 'is_active', 'rooms', 'created_at', 'updated_at']
        read_only_fields = ('id', 'created_at', 'updated_at')
        depth = 1


class ListingCreateSerializer(ListingSerializer):
    campus = serializers.PrimaryKeyRelatedField(queryset=Campus.objects.all(), required=False)
    neighborhood = serializers.PrimaryKeyRelatedField(queryset=Neighborhood.objects.all(), required=False)
    amenities = serializers.PrimaryKeyRelatedField(queryset=Amenity.objects.all(), many=True, required=False)
    
    class Meta(ListingSerializer.Meta):
        read_only_fields = ('id', 'created_at', 'updated_at')
