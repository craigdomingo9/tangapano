from django.db import models
from django.contrib.auth import get_user_model
from .base import BaseProfile
from .department_model import Department
from .role_model import Role

User = get_user_model()

class Employee(BaseProfile):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employee_profile')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='employees')
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True, related_name='employees')
    date_hired = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.role.name if self.role else 'No Role'}"
