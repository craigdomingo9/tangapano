from django.contrib import admin
from listings.models import Listing, Amenity, Room, ListingAmenity, ListingImage

# Register your models here.
@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'landlord', 'campus', 'neighborhood', 'distance_from_campus', 'is_active',)
    search_fields = ('title', 'description')
    list_filter = ('is_active', 'campus', 'neighborhood')

@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('listing', 'max_occupants', 'current_occupants', 'rent_per_month', 'is_available', 'is_active')
    search_fields = ('listing__title', 'room_type')
    list_filter = ('is_available', 'is_active', 'max_occupants')

@admin.register(ListingAmenity)
class ListingAmenityAdmin(admin.ModelAdmin):
    list_display = ('listing', 'amenity')
    search_fields = ('listing__title', 'amenity__name')
    list_filter = ('listing', 'amenity')

@admin.register(ListingImage)
class ListingImageAdmin(admin.ModelAdmin):
    list_display = ('listing', 'image')
    search_fields = ('listing__title',)
    list_filter = ('listing',)
