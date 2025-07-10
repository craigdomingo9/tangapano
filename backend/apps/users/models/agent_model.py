from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Agent(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='agent_profile')
    agency_name = models.CharField(max_length=255, blank=True, null=True)
    agent_fee = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - Agent Profile"

