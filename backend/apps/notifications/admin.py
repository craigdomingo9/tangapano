from django.contrib import admin
from .models import Notification, NotableAction

admin.site.register(Notification)

@admin.register(NotableAction)
class NotableActionAdmin(admin.ModelAdmin):
    list_display = ('action_type', 'actor', 'timestamp')
    list_filter = ('action_type', 'timestamp')
    search_fields = ('description', 'actor__username')
    readonly_fields = ('timestamp',)