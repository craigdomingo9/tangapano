from django.contrib import admin
from listings.models import Listing, Amenity, Room, ListingAmenity, ListingImage

# Register your models here.
@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'landlord', 'rent_per_month', 'neighborhood', 'rent_per_month', 'is_active')
    search_fields = ('title', 'description')
    list_filter = ('is_active', 'campus', 'neighborhood')

@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('listing', 'room_type', 'max_occupancy', 'current_occupancy', 'rent_per_month', 'is_available', 'is_active')
    search_fields = ('listing__title', 'room_type')
    list_filter = ('is_available', 'is_active')

@admin.register(ListingAmenity)
class ListingAmenityAdmin(admin.ModelAdmin):
    list_display = ('listing', 'amenity')
    search_fields = ('listing__title', 'amenity__name')

@admin.register(ListingImage)
class ListingImageAdmin(admin.ModelAdmin):
    list_display = ('listing', 'image')
    search_fields = ('listing__title',)
    list_filter = ('listing',)
