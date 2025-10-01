from rest_framework import serializers
from listings.models import ListingImage, Listing

class ListingImageSerializer(serializers.ModelSerializer):
    # image = serializers.SerializerMethodField()

    class Meta:
        model = ListingImage
        fields = ['id', 'listing', 'image', 'caption', 'created_at', 'updated_at']
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    # def get_image(self, obj):
    #     request = self.context.get('request')
    #     if not request:
    #         return obj.image
        
    #     if obj.image:
    #         return obj.image.url.replace(f'https://{self.context.get("request").get_host()}', '').replace(f'http://{self.context.get("request").get_host()}', '')
    #     return None
    
    def validate(self, attrs):
        if not attrs.get('image'):
            raise serializers.ValidationError("Image field is required.")
        return attrs

class ListingImageCreateSerializer(serializers.ModelSerializer):
    listing = serializers.PrimaryKeyRelatedField(
        queryset=Listing.objects.all(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = ListingImage
        fields = ['listing', 'image', 'caption']
