from django.db import models
from django.contrib.auth import get_user_model
from .base import BaseProfile

User = get_user_model()

class Landlord(BaseProfile):
    TYPE_CHOICES = (
        ('individual', 'Individual'),
        ('agency', 'Agency/Company'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='landlord_profile')
    account_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='individual')
    company_name = models.CharField(max_length=255, blank=True, null=True)
    is_verified = models.BooleanField(default=False) # crucial for trust/safety

    def __str__(self):
        name = self.company_name if self.account_type == 'agency' else self.user.get_full_name()
        return f"{name} ({self.get_account_type_display()})"

