from django.core.management.base import BaseCommand

from listings.models import Amenity
from users.models import User, Agent
from campuses.models import Campus, Neighborhood

class Command(BaseCommand):
    help = 'Seed production data'

    def handle(self, *args, **options):
        self.stdout.write("🌍 Seeding Zimbabwean campuses and neighborhoods...")

        self.stdout.write("Creating campuses and neighborhoods...")
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

        for name, city in zip(campus_names, cities):
            # Create agent user for this campus
            username = "_".join(name.lower().split(" "))
            agent_user = User.objects.create_user(
                username=f"agent_{username}",
                email=f"agent_{username}@example.com",
                password="password123",
                first_name="Agent",
                last_name=name,
                role="agent"
            )
            
            # Create Agent linked to user and campus
            agent = Agent.objects.create(
                user=agent_user, 
                agency_name="Agency",
                agent_fee=10,
                phone_number="+263781901939"
            )
            campus = Campus.objects.create(name=name, city=city, agent=agent)

            for neighborhood_name in ZIM_NEIGHBORHOODS[city]:
                neighborhood = Neighborhood.objects.create(name=neighborhood_name, city=city)
                campus.neighborhoods.add(neighborhood)

        self.stdout.write(self.style.SUCCESS("✅ Campuses, neighborhoods, and agents seeded successfully."))
        
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
        self.stdout.write(self.style.SUCCESS("✅ Amenities created successfully."))
        