from django.db import models
from listings.models import Room

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
    
    # Inferred automatically from the Room -> Campus -> Agent connection
    contacted_agent = models.ForeignKey(
        "users.Agent", 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='received_interests'
    )
    
    # Guest Contact Details
    full_name = models.CharField(max_length=100)
    student_id = models.CharField(max_length=20)
    phone_number = models.CharField(max_length=20)
    year_of_study = models.CharField(max_length=50)
    program = models.CharField(max_length=100)
    
    # Preferences
    move_in_timeline = models.CharField(max_length=20, choices=MOVE_IN_TIMELINE_CHOICES, default='immediately')
    deposit_readiness = models.CharField(max_length=20, choices=DEPOSIT_READINESS_CHOICES, default='ready_now')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='cash')
    agree_to_terms = models.BooleanField(default=False)
    
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Interest: {self.full_name} -> {self.room}"
