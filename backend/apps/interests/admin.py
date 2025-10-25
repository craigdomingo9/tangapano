from django.contrib import admin
from interests.models import Interest

# Register your models here.

@admin.register(Interest)
class InterestAdmin(admin.ModelAdmin):
    list_display = ('room', 'contacted_agent', 'timestamp', 'full_name', 'student_id', 'phone_number', 'year_of_study', 'program', 'move_in_timeline', 'deposit_readiness', 'payment_method', 'agree_to_terms')
    list_filter = ('contacted_agent', 'timestamp', 'year_of_study', 'program', 'move_in_timeline', 'deposit_readiness', 'payment_method')
