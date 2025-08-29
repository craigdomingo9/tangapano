import os
from django.core.management.base import BaseCommand

from listings.models import Amenity
from users.models import User, Agent
from campuses.models import Campus, Neighborhood
from dotenv import load_dotenv

load_dotenv()


class Command(BaseCommand):
    help = 'Seed production data safely, avoiding data deletion and duplication.'

    def handle(self, *args, **options):
        # We've removed all .delete() calls to prevent data loss.
        self.stdout.write("🌍 Seeding Zimbabwean campuses and neighborhoods...")

        campus_names = [
            "University of Zimbabwe", "Midlands State University", "Great Zimbabwe University",
            "Chinhoyi University", "Lupane State University"
        ]
        cities = ["Harare", "Gweru", "Masvingo", "Chinhoyi", "Lupane"]
        
        ZIM_NEIGHBORHOODS = {
            "Harare": ["Avondale", "Borrowdale", "Mbare", "Greendale", "Mount Pleasant", "Waterfalls"],
            "Gweru": ["Senga KMP", "Senga CBZ", "Adelaide", "Randolph Park"],
            "Masvingo": ["Mucheke", "Rujeko", "Rhodes", "Junction", "Runyararo"],
            "Chinhoyi": ["Cold Stream", "Hunyani", "Gadzema", "Cherima", "Orange Grove"],
            "Lupane": ["Lupane Center", "Gwayi", "Jotsholo", "Dandanda", "Tshongogwe"],
        }

        # Use get_or_create to prevent creating duplicate campuses and agents.
        for name, city in zip(campus_names, cities):
            username = "_".join(name.lower().split(" "))
            agent_username = f"agent_{username}"

            # Safely get or create the agent user
            agent_user, user_created = User.objects.get_or_create(
                username=agent_username,
                defaults={
                    "email": f"{agent_username}@tangapano.com",
                    "password": "password123", # Set a default password
                    "first_name": "Agent",
                    "last_name": name,
                    "role": "agent"
                }
            )
            if user_created:
                self.stdout.write(f"Created new agent user: {agent_user.username}")
            else:
                self.stdout.write(f"Agent user already exists: {agent_user.username}")

            # Safely get or create the agent
            agent, agent_created = Agent.objects.get_or_create(
                user=agent_user,
                defaults={
                    "agency_name": "Agency",
                    "agent_fee": 10,
                    "phone_number": "+263781901939"
                }
            )
            if agent_created:
                self.stdout.write(f"Created new agent for {name}")
            else:
                self.stdout.write(f"Agent for {name} already exists.")

            # Safely get or create the campus
            campus, campus_created = Campus.objects.get_or_create(
                name=name,
                defaults={"city": city, "agent": agent}
            )
            if campus_created:
                self.stdout.write(f"Created new campus: {campus.name}")
            else:
                self.stdout.write(f"Campus already exists: {campus.name}")

            # Safely get or create neighborhoods and link them to the campus.
            for neighborhood_name in ZIM_NEIGHBORHOODS[city]:
                neighborhood, neighborhood_created = Neighborhood.objects.get_or_create(
                    name=neighborhood_name,
                    defaults={"city": city}
                )
                if neighborhood_created:
                    self.stdout.write(f"  Created new neighborhood: {neighborhood.name}")
                # Add the neighborhood to the campus, checking if it's already there.
                campus.neighborhoods.add(neighborhood)

        self.stdout.write(self.style.SUCCESS("✅ Campuses, neighborhoods, and agents seeded successfully."))
        
        self.stdout.write("🧱 Creating amenities...")
        amenities_data = [
            {"name": "wifi", "display_name": "WiFi"},
            {"name": "air_conditioning", "display_name": "Air Conditioning"},
            {"name": "study_desk", "display_name": "Study Desk & Chair"},
            {"name": "wardrobe", "display_name": "Wardrobe or Closet"},
            {"name": "multiple_bathrooms", "display_name": "Multiple Bathrooms"},
            {"name": "geyser", "display_name": "24/7 Hot Water"},
            {"name": "refrigerator", "display_name": "Refrigerator"},
            {"name": "electricity", "display_name": "Electricity"},
            {"name": "no_curfew", "display_name": "No Curfew"},
            {"name": "solar_power", "display_name": "Solar Power"},
            {"name": "shared_kitchen", "display_name": "Shared Full Kitchen"},
            {"name": "laundry_facility", "display_name": "Washing Machine"},
            {"name": "study_room", "display_name": "Dedicated Quiet Study Room"},
            {"name": "common_lounge", "display_name": "Common Lounge Area"},
            {"name": "parking", "display_name": "Secure Parking"},
            {"name": "security_gate", "display_name": "Security Gate"},
            {"name": "cctv", "display_name": "CCTV Surveillance"},
            {"name": "on_site_guard", "display_name": "On-Site Security Guard"},
            {"name": "starlink_internet", "display_name": "Starlink Internet"},
            {"name": "bbq_area", "display_name": "BBQ Area"},
            {"name": "game_room", "display_name": "Game Room (Pool table, etc.)"},
            {"name": "disabled_access", "display_name": "Wheelchair Accessible"}
        ]

        for amenity in amenities_data:
            Amenity.objects.get_or_create(
                name=amenity["name"],
                defaults={"display_name": amenity["display_name"]}
            )
        self.stdout.write(self.style.SUCCESS("✅ Amenities created successfully."))
        
        # Safely get or create the admin user.
        self.stdout.write(f"👨‍💼 Creating admin user...")
        admin_user, admin_created = User.objects.get_or_create(
            username=os.getenv("DJANGO_ADMIN_USERNAME"),
            defaults={
                "email": os.getenv("DJANGO_ADMIN_EMAIL"),
                "is_staff": True,
                "is_superuser": True,
                "first_name": "Admin",
                "last_name": "User",
                "role": "admin"
            }
        )
        if admin_created:
            admin_user.set_password(os.getenv("DJANGO_ADMIN_PASSWORD"))
            admin_user.save()
            self.stdout.write(self.style.SUCCESS("✅ Admin user created successfully."))
        else:
            self.stdout.write(self.style.WARNING("⚠️ Admin user already exists."))
