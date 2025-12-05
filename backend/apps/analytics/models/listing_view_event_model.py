from django.db import models
from django.conf import settings


class ListingViewEvent(models.Model):
    """
    Raw Log: Who viewed what and when.
    """
    listing = models.ForeignKey("listings.Listing", on_delete=models.CASCADE, related_name="analytics_views")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    session_key = models.CharField(max_length=40, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    source = models.CharField(max_length=50, default='direct')

    class Meta:
        indexes = [
            models.Index(fields=['listing', 'timestamp']),
        ]
