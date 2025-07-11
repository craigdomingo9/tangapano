from django.contrib import admin
from campuses.models import Campus, Neighborhood

# Register your models here.


@admin.register(Campus)
class CampusAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'agents')
    search_fields = ('name', 'city', 'neighborhoods')
    list_filter = ('name',)

@admin.register(Neighborhood)
class NeighborhoodAdmin(admin.ModelAdmin):
    list_display = ('name', 'city')
    search_fields = ('name', 'city')
    list_filter = ('name',)
