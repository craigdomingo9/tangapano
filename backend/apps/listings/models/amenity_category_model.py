from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=50, unique=True, db_index=True)
    display_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.display_name
    