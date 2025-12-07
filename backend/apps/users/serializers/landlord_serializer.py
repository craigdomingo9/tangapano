from rest_framework import serializers
from users.models import Landlord

class LandlordSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    joined_at = serializers.SerializerMethodField()
    
    # NEW: Fetch Active Tier Name
    current_tier = serializers.SerializerMethodField()
    
    class Meta:
        model = Landlord
        fields = [
            "id",
            "user",
            "username",
            "full_name",
            "account_type",
            "company_name",
            "is_verified",
            "phone_number",
            "address",
            "current_tier",
            "joined_at",
        ]
        read_only_fields = ["id", "user", "joined_at"]
    
    def get_current_tier(self, obj):
        # Efficiently get the active subscription
        sub = obj.subscriptions.filter(status='active').first()
        return sub.tier.name if sub else "Free"
    
    def get_joined_at(self, obj):
        return obj.user.date_joined.strftime("%Y-%m-%d")