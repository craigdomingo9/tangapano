from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import Count
from tqdm import tqdm
from faker import Faker
import random
import os
from django.core.files import File

from listings.models import Listing, Amenity, Room, ListingImage
from campuses.models import Campus
from users.models import Landlord, User

fake = Faker()


class Command(BaseCommand):
    help = "Seed the database with landlords, listings, rooms, and amenities"

    def add_arguments(self, parser):
        parser.add_argument(
            '--landlords', type=int, default=100, help='Number of landlords to create'
        )
        parser.add_argument(
            '--listings', type=int, default=5, help='Listings per landlord'
        )

    @transaction.atomic
    def handle(self, *args, **options):
        landlords_count = options['landlords']
        listings_per_landlord = options['listings']

        self.stdout.write(self.style.WARNING("🧹 Deleting old data..."))
        Room.objects.all().delete()
        Listing.objects.all().delete()
        Landlord.objects.all().delete()
        Amenity.objects.all().delete()

        self.stdout.write("🧱 Creating amenities...")
        amenities_data = [
            {"name": "wifi", "display_name": "WIFI"},
            {"name": "geyser", "display_name": "Geyser"},
            {"name": "study_room", "display_name": "Study Room"},
            {"name": "study_desk", "display_name": "Study Desk"},
            {"name": "parking", "display_name": "Parking"},
            {"name": "durawall", "display_name": "Durawall"},
            {"name": "guard_dog", "display_name": "Guard Dog"},
            {"name": "electricity", "display_name": "Electricity"},
            {"name": "no_curfew", "display_name": "No Curfew"},
            {"name": "solar_power", "display_name": "Solar Power"},
            {"name": "washing_machine", "display_name": "Washing Machine"},
            {"name": "refrigerator", "display_name": "Refrigerator"},
        ]

        for amenity in amenities_data:
            Amenity.objects.create(**amenity)

        amenities = list(Amenity.objects.all())

        self.stdout.write("🏙️ Loading campuses and neighborhoods...")
        campuses = list(Campus.objects.annotate(num_neighborhoods=Count('neighborhoods')).filter(num_neighborhoods__gt=0))

        if not campuses:
            self.stdout.write(self.style.ERROR("🚫 No campuses with neighborhoods found. Seed campuses first."))
            return

        # Create admin user
        self.stdout.write(f"👨‍💼 Creating admin user...")
        _ = User.objects.create_superuser(
            username="admin",
            email="craigdomingo9@gmail.com",
            password="connected2005",
            first_name="Admin",
            last_name="User",
            role="admin"
        )

        self.stdout.write(f"👨‍💼 Creating {landlords_count} landlords...")
        for i in tqdm(range(landlords_count), desc="Creating Landlords"):
            user = User.objects.create_user(
                username=f'landlord_{i + 1}',
                email=fake.unique.email(),
                password="password123",
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                role="landlord"
            )
            landlord = Landlord.objects.create(
                user=user,
                phone_number=fake.phone_number(),
                company_name=fake.company(),
                address=fake.address()
            )

            for _ in range(listings_per_landlord):
                campus = random.choice(campuses)
                neighborhood = random.choice(list(campus.neighborhoods.all()))

                listing = Listing.objects.create(
                    title=fake.company() + " Residence",
                    campus=campus,
                    neighborhood=neighborhood,
                    landlord=landlord,
                    distance_from_campus=random.choice([10, 15, 25, 30, 45, 60]),
                )

                # Assign random image
                fake_image_dir = os.path.join(os.getcwd(), 'fake-images')
                image_files = [f for f in os.listdir(fake_image_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.avif', '.webp'))]

                if image_files:
                    selected_image = random.choice(image_files)
                    image_path = os.path.join(fake_image_dir, selected_image)

                    with open(image_path, 'rb') as f:
                        ListingImage.objects.create(
                            listing=listing,
                            image=File(f, name=selected_image)
                        )

                # Add amenities directly using ManyToMany field
                selected_amenities = random.sample(amenities, k=random.randint(5, 8))
                listing.amenities.set(selected_amenities)

                for _ in range(random.randint(3, 7)):
                    max_occupants = random.choice([1, 2, 3])
                    current_occupants = max_occupants - random.choice([0, 1, 2])
                    if current_occupants > max_occupants or current_occupants < 0: current_occupants = 0
                    
                    base_price = 50 + (4 - max_occupants) * 20
                    rent = base_price + random.choice([-10, -5, 0, 5, 10])  # +/- 10%

                    Room.objects.create(
                        listing=listing,
                        rent_per_month=rent,
                        max_occupants=max_occupants,
                        current_occupants=current_occupants,
                        gender_preference=random.choice(["male", "female", "any"]),
                    )

        self.stdout.write(self.style.SUCCESS("✅ Database seeded successfully!"))
