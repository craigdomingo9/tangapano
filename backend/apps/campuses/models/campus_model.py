from django.db import models
from campuses.models.neighborhood_model import Neighborhood

class Campus(models.Model):
    name = models.CharField(max_length=255, unique=True)
    city = models.CharField(max_length=255, blank=True)
    agents = models.ForeignKey(
        "users.Agent",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    neighborhoods = models.ManyToManyField(Neighborhood, related_name="campuses", blank=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Campuses"
