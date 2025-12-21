from django.contrib import admin
from .models.user_session_model import UserSession
from .models.listing_view_event_model import ListingViewEvent
from .models.listing_stat_model import ListingStat

@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    list_display = ('user', 'session_key', 'ip_address', 'date', 'last_seen', 'hit_count')
    list_filter = ('date', 'user')
    search_fields = ('session_key', 'ip_address', 'user__email')

@admin.register(ListingViewEvent)
class ListingViewEventAdmin(admin.ModelAdmin):
    list_display = ('listing', 'user', 'session_key', 'timestamp', 'source')
    list_filter = ('timestamp', 'source')
    search_fields = ('session_key', 'listing__title', 'user__email')

@admin.register(ListingStat)
class ListingStatAdmin(admin.ModelAdmin):
    list_display = ('listing', 'total_views', 'total_inquiries', 'last_updated')
    search_fields = ('listing__title',)
