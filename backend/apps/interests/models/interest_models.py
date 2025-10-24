from django.db import models
from users.models import Agent
from listings.models import Room

# Create your models here.
class Interest(models.Model):
    MOVE_IN_TIMELINE_CHOICES = [
        ('immediately', 'Immediately (within 1 week)'),
        ('2_weeks', 'Within 2 weeks'),
        ('1_month', 'Within 1 month'),
        ('next_semester', 'Next Semester'),
    ]
    DEPOSIT_READINESS_CHOICES = [
        ('ready_now', 'Yes, ready to pay deposit'),
        ('within_24h', 'Will arrange within 24 hours'),
        ('need_time', 'Need more time to arrange funds'),
    ]
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('mobile', 'Mobile Payment'),
        ('bank_transfer', 'Bank Transfer'),
    ]
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='interests')
    contacted_agent = models.ForeignKey(Agent, on_delete=models.DO_NOTHING, related_name='interests')
    full_name = models.CharField(max_length=100)
    student_id = models.CharField(max_length=20)
    phone_number = models.CharField(max_length=20)
    year_of_study = models.CharField(max_length=50)
    program = models.CharField(max_length=100)
    room_id = models.CharField(max_length=50)
    move_in_timeline = models.Choices(MOVE_IN_TIMELINE_CHOICES)
    deposit_readiness = models.Choices(DEPOSIT_READINESS_CHOICES)
    payment_method = models.Choices(PAYMENT_METHOD_CHOICES)
    agree_to_terms = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Interest in {self.room} handled by Agent: {self.contacted_agent}"
