from rest_framework import serializers
from listings.models import ListingImage, Listing
import os

class ListingImageSerializer(serializers.ModelSerializer):
    display_image = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = ListingImage
        fields = ['id', 'image', 'display_image', 'caption', 'created_at', 'updated_at']
        read_only_fields = ('id', 'display_image', 'created_at', 'updated_at')
    
    def get_display_image(self, obj):
        if obj.display_image:
            return obj.display_image.url
        return obj.image.url
    
    def get_image(self, obj):
        if obj.image:
            print(obj.image)
            return obj.image.url.replace(f'http://{self.context.get("request").get_host()}', '').replace(f'https://{self.context.get("request").get_host()}', '')
        return None
    
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
    
    def validate_image(self, value):
        if value:
            # Basic validation
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in ['.jpg', '.jpeg', '.png', '.webp']:
                raise serializers.ValidationError(
                    "Only JPG, PNG, and WebP images are supported"
                )
            if value.size > 10 * 1024 * 1024:  # 10MB
                raise serializers.ValidationError("Image too large. Max 10MB.")
        return value

