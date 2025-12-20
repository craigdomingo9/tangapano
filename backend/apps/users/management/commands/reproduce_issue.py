from django.core.management.base import BaseCommand
from users.models import User, Department, Role, Employee
from users.serializers.employee_serializer import EmployeeSerializer
from rest_framework.exceptions import ValidationError

class Command(BaseCommand):
    help = 'Reproduce Employee Serializer Issues'

    def handle(self, *args, **kwargs):
        # Setup
        Department.objects.all().delete()
        Role.objects.all().delete()
        Employee.objects.all().delete()
        User.objects.filter(username__in=['test_new', 'test_dup', 'test_update']).delete()

        dept = Department.objects.create(name='IT')
        role = Role.objects.create(name='Dev')

        # 1. Test Create (New)
        print("\n--- Testing Create (New) ---")
        data_new = {
            "user": {
                "first_name": "Test",
                "last_name": "New",
                "email": "new@example.com",
                "username": "test_new"
            },
            "department_id": dept.id,
            "role_id": role.id,
            "date_hired": "2025-01-01",
            "phone_number": "123",
            "address": "Address"
        }
        ser = EmployeeSerializer(data=data_new)
        if ser.is_valid():
            emp = ser.save()
            print("SUCCESS: Created", emp)
        else:
            print("FAILURE: Create New:", ser.errors)

        # 2. Test Create (Duplicate) - Should Fail Gracefully
        print("\n--- Testing Create (Duplicate) ---")
        data_dup = data_new.copy() # Same username 'test_new'
        ser = EmployeeSerializer(data=data_dup)
        if ser.is_valid():
            print("FAILURE: Duplicate should NOT be valid!")
            try:
                ser.save()
                print("CRITICAL FAILURE: Saved duplicate!")
            except Exception as e:
                print(f"Server Error on Duplicate Save: {e}")
        else:
            print("SUCCESS: Duplicate caught:", ser.errors)

        # 3. Test Update
        print("\n--- Testing Update ---")
        data_update = {
            "user": {
                "first_name": "TestUpdated",
                "last_name": "New", # Unchanged
                "email": "new@example.com", # Unchanged
                "username": "test_new" # Unchanged
            },
            "department_id": dept.id,
            "role_id": role.id,
            "date_hired": "2025-01-01"
        }
        
        # We fetch the employee we created in step 1
        emp = Employee.objects.get(user__username='test_new')
        ser_update = EmployeeSerializer(instance=emp, data=data_update, partial=True)
        
        if ser_update.is_valid():
            emp_updated = ser_update.save()
            print("SUCCESS: Updated", emp_updated.user.first_name)
        else:
            print("FAILURE: Update:", ser_update.errors)
