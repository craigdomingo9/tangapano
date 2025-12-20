from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from users.models import User, Agent, Landlord

# 1. Customize User Admin to show roles clearly
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'role', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_active')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Role Info', {'fields': ('role',)}),
    )

# 2. Agent Admin
@admin.register(Agent)
class AgentAdmin(admin.ModelAdmin):
    list_display = ('user', 'agency_name', 'phone_number')
    search_fields = ('user__username', 'agency_name')

from notifications.utils.action_utils import log_and_notify_notable_action

# 3. Landlord Admin (HEAVILY MODIFIED)
@admin.register(Landlord)
class LandlordAdmin(admin.ModelAdmin):
    list_display = (
        'get_full_name', 
        'account_type', 
        'company_name', 
        'phone_number', 
        'is_verified'
    )
    list_filter = ('account_type', 'is_verified', 'user__date_joined')
    search_fields = ('user__username', 'user__email', 'company_name', 'phone_number')
    actions = ['mark_as_verified', 'mark_as_unverified']

    def get_full_name(self, obj):
        return obj.user.get_full_name()
    get_full_name.short_description = 'Name'

    # --- ADMIN ACTIONS ---
    def mark_as_verified(self, request, queryset):
        rows_updated = queryset.update(is_verified=True)
        
        # Log and Notify
        usernames = ", ".join(queryset.values_list('user__username', flat=True))
        log_and_notify_notable_action(
            action_type='landlord_verified',
            description=f"Admin {request.user.username} verified {rows_updated} landlords: {usernames}",
            actor=request.user,
            metadata={'rows_updated': rows_updated, 'usernames': list(queryset.values_list('user__username', flat=True))}
        )
        
        self.message_user(request, f"{rows_updated} landlords successfully verified.")
    mark_as_verified.short_description = "Mark selected landlords as Verified"

    def mark_as_unverified(self, request, queryset):
        rows_updated = queryset.update(is_verified=False)
        
        # Log and Notify
        usernames = ", ".join(queryset.values_list('user__username', flat=True))
        log_and_notify_notable_action(
            action_type='landlord_unverified',
            description=f"Admin {request.user.username} unverified {rows_updated} landlords: {usernames}",
            actor=request.user,
            metadata={'rows_updated': rows_updated, 'usernames': list(queryset.values_list('user__username', flat=True))}
        )
        
        self.message_user(request, f"{rows_updated} landlords marked unverified.")


from users.models import Department, Role, Employee

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)
    filter_horizontal = ('permissions',)

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('user', 'department', 'role', 'date_hired')
    list_filter = ('department', 'role')
    search_fields = ('user__username', 'user__first_name', 'user__last_name')