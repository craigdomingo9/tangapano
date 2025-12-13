from rest_framework import serializers
from listings.models import Listing, ListingImage
from .room_serializer import RoomSerializer
from campuses.serializers import CampusSerializer
from .amenity_serializer import AmenitySerializer
from .listing_image_serializer import ListingImageSerializer


class RetrieveListingSerializer(serializers.ModelSerializer):
    amenities = AmenitySerializer(many=True)
    rooms = serializers.SerializerMethodField()
    campus = CampusSerializer(read_only=True)
    images = ListingImageSerializer(many=True, read_only=True)
    location = serializers.SerializerMethodField()
    campus_location = serializers.SerializerMethodField()
    
    class Meta:
        model = Listing
        fields = [
            'id', 'landlord', 'title', 'description', 'images',
            'amenities',
            'location', 'campus_location',
            'campus', 'neighborhood',
            'apply_agent_fee', 'is_locked',
            'distance_from_campus', 'is_active', 'rooms',
            'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'created_at', 'updated_at')
        depth = 1
    
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

    def get_location(self, obj):
        if not hasattr(obj, 'location'): return {}
        location = {
            "lat": obj.location.fuzzy_latitude,
            "lon": obj.location.fuzzy_longitude,
        }
        return location

    def get_campus_location(self, obj):
        location = {
            "lat": obj.campus.latitude,
            "lon": obj.campus.longitude,
        }
        return location
    
    def to_representation(self, instance):
        # Get the original representation (the dictionary)
        representation = super().to_representation(instance)
        
        # Check if landlord exists in the data, then remove phone_number
        if representation.get('landlord'):
            representation['landlord'].pop('phone_number', None)
            representation['landlord'].pop('address', None)
            
        return representation

