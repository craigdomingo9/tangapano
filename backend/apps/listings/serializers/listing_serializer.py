from rest_framework import serializers
from listings.models import Listing, Amenity, ListingAmenity
from .listing_amenity_serializer import ListingAmenitySerializer
from .room_serializer import RoomSerializer
from campuses.serializers import CampusSerializer


class ListingSerializer(serializers.ModelSerializer):
    # Accept amenity IDs for write
    amenity_ids = serializers.PrimaryKeyRelatedField(
        queryset=Amenity.objects.all(),
        write_only=True,
        many=True,
        source='amenities'
    )

    # Return full nested amenities on read
    amenities = ListingAmenitySerializer(many=True)
    rooms = RoomSerializer(many=True, read_only=True)
    campus = CampusSerializer(read_only=True)
    
    class Meta:
        model = Listing
        fields = ['id', 'landlord', 'title', 'description', 'images', 'amenities', 'amenity_ids', 'rent_per_month', 'campus', 'neighborhood', 'distance_from_campus', 'is_active', 'rooms', 'created_at', 'updated_at']
        read_only_fields = ('id', 'created_at', 'updated_at')
        depth = 1
    
    def update(self, instance, validated_data):
        # Pop and handle amenity IDs if present
        amenity_ids = validated_data.pop('amenities', None)

        # Update main listing fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()

        # Update amenities if provided
        if amenity_ids is not None:
            instance.amenities.all().delete()
            ListingAmenity.objects.bulk_create([
                ListingAmenity(listing=instance, amenity=amenity) for amenity in amenity_ids
            ])

        return instance

