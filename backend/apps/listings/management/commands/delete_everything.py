from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import Count
from tqdm import tqdm
from faker import Faker
import random
import os
from django.core.files import File
from dotenv import load_dotenv

from listings.models import Listing, Amenity, Room, ListingImage
from campuses.models import Campus
from users.models import Landlord, User

fake = Faker()

load_dotenv()


class Command(BaseCommand):
    help = "Delete everything"

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("🧹 Deleting old data..."))
        Room.objects.all().delete()
        Listing.objects.all().delete()
        Landlord.objects.all().delete()
        User.objects.all().delete()

        self.stdout.write(self.style.SUCCESS("✅ Data deleted successfully!"))
