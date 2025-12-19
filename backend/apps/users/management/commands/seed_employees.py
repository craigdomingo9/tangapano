from django.core.management.base import BaseCommand
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from users.models import User, Department, Role, Employee
from faker import Faker
import random

class Command(BaseCommand):
    help = 'Seeds the database with Employees, Roles, Permissions, and Departments'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING('Seeding data...'))
        fake = Faker()

        # 1. Create Departments
        departments = ['HR', 'Engineering', 'Sales', 'Marketing', 'Finance']
        dept_objs = []
        for d_name in departments:
            dept, created = Department.objects.get_or_create(name=d_name)
            if created:
                self.stdout.write(f'Created Department: {d_name}')
            dept_objs.append(dept)

        # 2. Create Permissions (Standard Django Permissions)
        # For simplicity, we stick to what Django creates automatically for models,
        # but here we can ensure we fetch them for assignment.
        content_type = ContentType.objects.get_for_model(Employee)
        view_perm = Permission.objects.filter(content_type=content_type, codename='view_employee').first()
        
        # 3. Create Roles
        roles_data = {
            'Manager': [view_perm] if view_perm else [],
            'Developer': [],
            'Intern': []
        }
        
        role_objs = []
        for r_name, perms in roles_data.items():
            role, created = Role.objects.get_or_create(name=r_name)
            if created:
                self.stdout.write(f'Created Role: {r_name}')
                if perms:
                    role.permissions.set(perms)
            role_objs.append(role)

        # 4. Create Employees
        for _ in range(10):
            username = fake.user_name()
            email = fake.email()
            
            if User.objects.filter(username=username).exists():
                continue

            user = User.objects.create_user(
                username=username,
                email=email,
                password='password123',
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                role='employee'
            )
            
            Employee.objects.create(
                user=user,
                department=random.choice(dept_objs),
                role=random.choice(role_objs),
                date_hired=fake.date_between(start_date='-5y', end_date='today')
            )
            self.stdout.write(f'Created Employee: {user.username}')

        self.stdout.write(self.style.SUCCESS('Successfully seeded employees!'))
