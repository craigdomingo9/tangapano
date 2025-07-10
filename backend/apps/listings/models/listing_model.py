from django.db import models



class Listing(models.Model):
    landlord = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="listings"
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    rent_per_month = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    campus = models.ForeignKey(
        "campuses.Campus",
        on_delete=models.SET_NULL,
        null=True,
    )
    neighborhood = models.ForeignKey(
        "campuses.Neighborhood",
        on_delete=models.SET_NULL,
        null=True,
    )
    distance_from_campus = models.FloatField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Listings"

    def __str__(self):
        return self.title
