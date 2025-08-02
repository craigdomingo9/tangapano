from django.contrib import admin
from interests.models import Interest

# Register your models here.

@admin.register(Interest)
class InterestAdmin(admin.ModelAdmin):
    list_display = ('room', 'contacted_agent', 'timestamp')
    list_filter = ('contacted_agent', 'timestamp')
