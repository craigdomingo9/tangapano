from django.db import models
from users.models import Agent
from listings.models import Room

# Create your models here.
class Interest(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='interests')
    contacted_agent = models.ForeignKey(Agent, on_delete=models.DO_NOTHING, related_name='interests')
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Interest in {self.room} handled by Agent: {self.contacted_agent}"
