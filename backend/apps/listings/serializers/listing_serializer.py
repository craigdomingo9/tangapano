from rest_framework import serializers
from listings.models import Listing, Amenity, ListingLocation
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


class ListingLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingLocation
        fields = ['latitude', 'longitude'] 

class ListingCreateSerializer(serializers.ModelSerializer):
    campus = serializers.PrimaryKeyRelatedField(queryset=Campus.objects.all(), required=False)
    neighborhood = serializers.PrimaryKeyRelatedField(queryset=Neighborhood.objects.all(), required=False)
    
    location = ListingLocationSerializer(required=False, write_only=True)
    
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
            'title', 
            'amenity_ids',
            'campus', 'neighborhood', 'location',
            'apply_agent_fee', 
            'distance_from_campus', 
        ]
    
    def create(self, validated_data):
        location_data = validated_data.pop("location", None)
        
        listing = super().create(validated_data)
        
        if location_data:
            ListingLocation.objects.create(listing=listing, **location_data)
        
        return listing
    

    def update(self, instance, validated_data):
        location_data = validated_data.pop("location", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if location_data:
            if hasattr(instance, 'location') and instance.location:
                for attr, value in location_data.items():
                    setattr(instance.location, attr, value)
                instance.location.save()
            else:
                ListingLocation.objects.create(listing=instance, **location_data)

        return instance