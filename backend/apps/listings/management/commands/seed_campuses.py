from django.core.management.base import BaseCommand
from campuses.models import Campus, Neighborhood
from users.models import User, Agent
import random
from faker import Faker

fake = Faker()

class Command(BaseCommand):
    help = "Deletes all campuses and neighborhoods and seeds new Zimbabwean data."

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("🚨 Deleting all campuses and neighborhoods..."))
        Neighborhood.objects.all().delete()
        Campus.objects.all().delete()
        Agent.objects.all().delete()
        User.objects.all().delete()

        self.stdout.write("🌍 Seeding Zimbabwean campuses and neighborhoods...")

        self.stdout.write("Creating campuses and neighborhoods...")
        campus_names = [
            "University of Zimbabwe", "Midlands State University", "Great Zimbabwe University",
            "Chinhoyi University"
        ]
        cities = ["Harare", "Gweru", "Masvingo", "Chinhoyi"]

        
        ZIM_NEIGHBORHOODS = {
            "Harare": ["Avondale", "Borrowdale", "Mbare", "Greendale", "Mount Pleasant", "Waterfalls"],
            "Gweru": ["Senga KMP", "Senga CBZ", "Adelaide", "Randolph Park"],
            "Masvingo": ["Mucheke", "Rujeko", "Rhodes", "Junction", "Runyararo"],
            "Chinhoyi": ["Cold Stream", "Hunyani", "Gadzema", "Cherima", "Orange Grove"],
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
                agency_name=fake.company(),
                agent_fee=random.choice([15, 20, 10]),
                phone_number="+263781901939"
            )
            campus = Campus.objects.create(name=name, city=city, agent=agent)

            for neighborhood_name in ZIM_NEIGHBORHOODS[city]:
                neighborhood = Neighborhood.objects.create(name=neighborhood_name, city=city)
                campus.neighborhoods.add(neighborhood)

        self.stdout.write(self.style.SUCCESS("✅ Campuses, neighborhoods, and agents seeded successfully."))
