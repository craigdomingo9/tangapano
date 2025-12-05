from django.db import models
from django.conf import settings

class Notification(models.Model):
    TYPE_CHOICES = [
        ('info', 'Information'),
        ('success', 'Success'),
        ('warning', 'Warning'),
        ('error', 'Critical Alert'),
    ]
    
    CATEGORY_CHOICES = [
        ('billing', 'Billing & Subscription'),
        ('listing', 'Listing Status'),
        ('inquiry', 'New Student Inquiry'),
        ('system', 'System Update'),
    ]

    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='info')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='system')
    
    # Integration logic (Optional deep linking)
    action_link = models.CharField(max_length=255, blank=True, null=True) # e.g., "/dashboard/listings/15"
    
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.recipient} - {self.title}"