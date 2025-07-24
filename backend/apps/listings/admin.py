from django.contrib import admin
from listings.models import Listing, Amenity, Room, ListingImage

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
    list_display = ('listing', 'max_occupants', 'current_occupants', 'rent_per_month', 'is_available')
    search_fields = ('listing__title',)
    list_filter = ('is_available', 'is_active', 'max_occupants')


@admin.register(ListingImage)
class ListingImageAdmin(admin.ModelAdmin):
    list_display = ('listing', 'image')
    search_fields = ('listing__title',)
    list_filter = ('listing',)
