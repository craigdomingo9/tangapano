from django.db import models
from django.utils import timezone
from datetime import timedelta
from .tier_model import Tier


class Subscription(models.Model):
    """
    Links a Landlord to a Tier.
    """
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled'),
        ('pending', 'Pending Payment'),
    ]

    landlord = models.ForeignKey("users.Landlord", on_delete=models.CASCADE, related_name="subscriptions")
    tier = models.ForeignKey(Tier, on_delete=models.PROTECT)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)
    
    # Audit fields
    transaction_ref = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Auto-calculate end_date if new and active
        if not self.pk and self.status == 'active' and not self.end_date:
            self.end_date = timezone.now() + timedelta(days=self.tier.duration_days)
        super().save(*args, **kwargs)

    @property
    def is_valid(self):
        return self.status == 'active' and self.end_date > timezone.now()

    def __str__(self):
        return f"{self.landlord} - {self.tier.name}"