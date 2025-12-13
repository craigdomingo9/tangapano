from rest_framework import serializers
from listings.models import Listing, Amenity
from .room_serializer import RoomSerializer
from campuses.serializers import CampusSerializer, NeighborhoodSerializer
from campuses.models import Campus, Neighborhood
from .amenity_serializer import AmenitySerializer
from .listing_image_serializer import ListingImageSerializer
from users.serializers import LandlordSerializer
from .listing_location_serializer import ListingMapSerializer


class ListingSerializer(serializers.ModelSerializer):
    amenities = AmenitySerializer(many=True, read_only=True)
    rooms = serializers.SerializerMethodField() # Custom method for numbering
    campus = CampusSerializer(read_only=True)
    neighborhood = NeighborhoodSerializer(read_only=True)
    landlord = LandlordSerializer(read_only=True)
    images = ListingImageSerializer(many=True, read_only=True, source='ordered_images')
    location = ListingMapSerializer()

    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'description', 'location', 'landlord',
            'campus', 'neighborhood', 'amenities', 
            'rooms', 'images', 'distance_from_campus',
            'apply_agent_fee', 'is_locked', 'is_active',
            'created_at', 'updated_at'
        ]

    def get_rooms(self, obj):
        """
        Calculates room number in Python to avoid N+1 DB queries.
        """
        rooms = obj.rooms.all() # Prefetched in ViewSet
        data = []
        for index, room in enumerate(rooms, start=1):
            # Serialize individually or manually construct dict for speed
            r_data = RoomSerializer(room).data
            r_data['room_number'] = index # Inject number here
            data.append(r_data)
        return data


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
