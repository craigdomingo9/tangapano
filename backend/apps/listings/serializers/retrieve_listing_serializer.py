from rest_framework import serializers
from listings.models import Listing, ListingImage
from .room_serializer import RoomSerializer
from campuses.serializers import CampusSerializer
from .amenity_serializer import AmenitySerializer
from .listing_image_serializer import ListingImageSerializer


class RetrieveListingSerializer(serializers.ModelSerializer):
    amenities = AmenitySerializer(many=True)
    rooms = RoomSerializer(many=True, read_only=True)
    campus = CampusSerializer(read_only=True)
    images = ListingImageSerializer(many=True, read_only=True)
    
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


# class ListingImageSerializer(serializers.ModelSerializer):
#     image = serializers.SerializerMethodField()

#     class Meta:
#         model = ListingImage
#         fields = ['id', 'image', 'caption']

#     def get_image(self, obj):
#         if obj.image:
#             print(obj.image)
#             return obj.image.url.replace(f'http://{self.context.get("request").get_host()}', '')
#         return None


