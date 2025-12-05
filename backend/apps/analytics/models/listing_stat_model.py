from django.db import models


class ListingStat(models.Model):
    """
    Optimization: Aggregated counters.
    Updated in real-time or via Celery to avoid counting millions of ViewEvents rows.
    """
    listing = models.OneToOneField("listings.Listing", on_delete=models.CASCADE, related_name="stats")
    total_views = models.PositiveIntegerField(default=0)
    total_inquiries = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)