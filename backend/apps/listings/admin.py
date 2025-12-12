from django.contrib import admin
from listings.models import Listing, Amenity, Room, ListingImage, ListingLocation

@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'get_landlord', 'campus', 'neighborhood', 'is_active')
    search_fields = ('title', 'description', 'landlord__company_name', 'landlord__user__username')
    list_filter = ('is_active', 'campus__city', 'campus') # Filter by City, then Campus
    autocomplete_fields = ['landlord', 'campus', 'neighborhood']

    def get_landlord(self, obj):
        return obj.landlord.user.username
    get_landlord.short_description = 'Landlord'

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('listing', 'gender_preference', 'rent_per_month', 'occupancy_status')
    list_filter = ('gender_preference', 'is_active')
    search_fields = ('listing__title',)

    def occupancy_status(self, obj):
        return f"{obj.current_occupants}/{obj.max_occupants}"

# Register Amenity and ListingImage as standard
admin.site.register(Amenity)
admin.site.register(ListingImage)
admin.site.register(ListingLocation)