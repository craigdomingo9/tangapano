from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    ROLE_CHOICES = [
        ("landlord", "Landlord"),
        ("agent", "Agent"),
        ("admin", "Admin"),
    ]
    first_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=30, blank=True, null=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="landlord")

