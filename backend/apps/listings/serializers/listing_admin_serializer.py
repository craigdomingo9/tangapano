from rest_framework import serializers
from listings.models import Listing

class ListingAdminSerializer(serializers.ModelSerializer):
    """
    Specialized serializer for the Admin Data Table (Lighter than full detail).
    """
    landlord_name = serializers.CharField(source='landlord.user.get_full_name')
    campus_name = serializers.CharField(source='campus.name')
    
    # NEW: Vacancy Summary for the Progress Bar
    vacancy_stats = serializers.SerializerMethodField()
    main_image = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'landlord_name', 'campus_name', 
            'is_active', 'is_locked', 'vacancy_stats', 'main_image'
        ]

    def get_vacancy_stats(self, obj):
        # Aggregate room data efficiently
        total_beds = 0
        occupied_beds = 0
        for room in obj.rooms.all(): # Prefetched
            total_beds += room.max_occupants
            occupied_beds += room.current_occupants
        
        return {
            "total": total_beds,
            "filled": occupied_beds,
            "left": total_beds - occupied_beds,
            "percent": (occupied_beds / total_beds * 100) if total_beds > 0 else 0
        }

    def get_main_image(self, obj):
        img = obj.images.filter(is_face_image=True).first()
        return img.image.url if img else None