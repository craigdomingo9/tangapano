from django.db import models
from django.conf import settings

class NotableAction(models.Model):
    ACTION_TYPES = [
        ('employee_created', 'Employee Created'),
        ('employee_updated', 'Employee Updated'),
        ('landlord_created', 'Landlord Created'),
        ('landlord_updated', 'Landlord Updated'),
        ('landlord_verified', 'Landlord Verified'),
        ('landlord_unverified', 'Landlord Unverified'),
        ('user_registered', 'User Registered'),
        ('admin_login', 'Admin Login'),
        ('admin_temp_auth', 'Admin Privileged Auth'),
        ('listing_locked', 'Listing Locked'),
        ('listing_unlocked', 'Listing Unlocked'),
        ('campus_created', 'Campus Created'),
        ('campus_updated', 'Campus Updated'),
        ('city_created', 'City Created'),
        ('city_updated', 'City Updated'),
        ('neighborhood_created', 'Neighborhood Created'),
        ('neighborhood_updated', 'Neighborhood Updated'),
    ]


    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='actions_performed'
    )
    action_type = models.CharField(max_length=50, choices=ACTION_TYPES)
    description = models.TextField()
    metadata = models.JSONField(default=dict, blank=True)
    
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        actor_name = self.actor.username if self.actor else "System"
        return f"{actor_name} - {self.get_action_type_display()} - {self.timestamp}"
