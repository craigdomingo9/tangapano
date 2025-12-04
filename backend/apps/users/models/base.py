from django.db import models

class BaseProfile(models.Model):
    """
    Abstract base class for common contact details
    to ensure consistency across Landlords and Agents.
    """
    phone_number = models.CharField(max_length=30, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    # Future-proof: Add profile_image or logo here later

    class Meta:
        abstract = True