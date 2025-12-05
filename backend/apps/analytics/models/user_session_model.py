from django.db import models
from django.conf import settings


class UserSession(models.Model):
    """
    Tracks daily engagement (DAU).
    One record per User (or Anonymous Session) per Day.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    session_key = models.CharField(max_length=40, db_index=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    
    date = models.DateField(auto_now_add=True, db_index=True)
    last_seen = models.DateTimeField(auto_now=True)
    hit_count = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('session_key', 'date')
        indexes = [
            models.Index(fields=['date']),
        ]

