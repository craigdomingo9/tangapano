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
    amenities_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True
    )
    
    class Meta(ListingSerializer.Meta):
        fields = [
            'id', 'landlord', 'title', 'description', 'images',
            'amenities_ids', 'campus', 'neighborhood', 'distance_from_campus',
            'is_active', 'rooms', 'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def update(self, instance, validated_data):
        amenities_ids = validated_data.pop('amenities_ids', None)

        # Update Listing base fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if amenities_ids is not None:
            
            # Delete old amenities
            ListingAmenity.objects.filter(listing=instance).delete()
            
            # Fetch all Amenity objects once to reduce database queries
            all_amenities = {amenity.id: amenity for amenity in Amenity.objects.filter(id__in=amenities_ids)}

            for amenity_id in amenities_ids:
                amenity_instance = all_amenities.get(amenity_id)
                if amenity_instance: # Ensure the amenity exists before creating ListingAmenity
                    ListingAmenity.objects.create(
                        listing=instance,
                        amenity=amenity_instance # Pass the Amenity instance here
                    )
                else:
                    # Handle case where an amenity_id from input does not exist
                    print(f"Warning: Amenity with ID {amenity_id} not found.")

        return instance
