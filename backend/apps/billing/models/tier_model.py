from django.db import models

class Tier(models.Model):
    """
    Defines the subscription levels available on the platform.
    Managed via the Admin Dashboard.
    """
    name = models.CharField(max_length=50)  # e.g., "Gold Agency"
    slug = models.SlugField(unique=True)    # e.g., "gold_agency"
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_days = models.PositiveIntegerField(default=30)
    
    # Feature Flags / Limits
    max_listings = models.PositiveIntegerField(default=5)
    can_feature_listings = models.BooleanField(default=False)
    is_verified_badge = models.BooleanField(default=False)
    support_priority = models.CharField(max_length=20, default='standard')

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} (${self.price})"