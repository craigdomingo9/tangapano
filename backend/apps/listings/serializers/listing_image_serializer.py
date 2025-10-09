from rest_framework import serializers
from listings.models import ListingImage, Listing

class ListingImageSerializer(serializers.ModelSerializer):
    display_image = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = ListingImage
        fields = ['id', 'image', 'display_image', 'caption', 'created_at', 'updated_at']
        read_only_fields = ('id', 'display_image', 'created_at', 'updated_at')
    
    def get_display_image(self, obj):
        try:
            if obj.display_image:
                return obj.display_image.url
        except Exception as e:
            print(e)
        return obj.image.url
    
    def get_image(self, obj):
        if obj.image:
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
