from django.contrib import admin
from campuses.models import Campus, Neighborhood

# Register your models here.


@admin.register(Campus)
class CampusAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'agents', 'has_listings')
    search_fields = ('name', 'city', 'neighborhoods')
    list_filter = ('name',)

@admin.register(Neighborhood)
class NeighborhoodAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'has_listings')
    search_fields = ('name', 'city')
    list_filter = ('name',)
