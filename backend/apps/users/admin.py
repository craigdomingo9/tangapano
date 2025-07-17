from django.contrib import admin
from users.models import User, Agent, Landlord

# Register your models here.
admin.site.register(User)
admin.site.register(Agent)

@admin.register(Landlord)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'phone_number', 'user__role', 'user__first_name', 'user__last_name')
    search_fields = ('user__username', 'company_name')
    list_filter = ('company_name', 'user__date_joined')
