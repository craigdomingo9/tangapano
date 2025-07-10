from django.contrib import admin
from users.models import User, Agent, Landlord

# Register your models here.
admin.site.register(User)
admin.site.register(Agent)
admin.site.register(Landlord)
