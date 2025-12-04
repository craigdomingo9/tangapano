from django.contrib import admin
from interests.models import Interest

@admin.register(Interest)
class InterestAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'room', 'contacted_agent', 'timestamp', 'deposit_readiness')
    list_filter = ('timestamp', 'deposit_readiness', 'contacted_agent')
    search_fields = ('full_name', 'phone_number', 'student_id')
    autocomplete_fields = ['room', 'contacted_agent']
