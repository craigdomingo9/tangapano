from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User, Department, Role, Employee

class EmployeeAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testadmin', password='password123', role='admin')
        self.client.force_authenticate(user=self.user)
        
        self.department = Department.objects.create(name='IT')
        self.role = Role.objects.create(name='Developer')

    def test_create_department(self):
        url = reverse('department-list') # Standard router name
        data = {'name': 'HR'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Department.objects.count(), 2)

    def test_create_role(self):
        url = reverse('role-list')
        data = {'name': 'Manager'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Role.objects.count(), 2)

    def test_create_employee(self):
        url = reverse('employee-list')
        data = {
            "user": {
                "first_name": "Craig",
                "last_name": "Domingo",
                "email": "craigdomingo9@gmail.com",
                "username": "craigdomingo9"
            },
            "department_id": self.department.id,
            "role_id": self.role.id,
            "phone_number": "+263776808964",
            "date_hired": "2025-12-17",
            "address": "1546 Adelaide Park"
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Employee.objects.count(), 1)
        
        emp = Employee.objects.first()
        self.assertEqual(emp.user.username, "craigdomingo9")
        self.assertEqual(emp.user.email, "craigdomingo9@gmail.com")
        self.assertEqual(emp.phone_number, "+263776808964")
        self.assertEqual(str(emp.date_hired), "2025-12-17")
        self.assertEqual(emp.department, self.department)
    def test_create_duplicate_employee(self):
        User.objects.create_user(username='existing_user', email='exist@example.com', password='pass')
        url = reverse('employee-list')
        data = {
            "user": {
                "first_name": "Test",
                "last_name": "Duplicate",
                "email": "exist@example.com",
                "username": "existing_user"
            },
            "department_id": self.department.id,
            "role_id": self.role.id,
            "date_hired": "2025-01-01"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('user', response.data)
        self.assertIn('username', response.data['user'])

    def test_update_employee(self):
        # Create initial employee
        emp_user = User.objects.create_user(username='chris_initial', email='chris@example.com', password='pass', role='employee')
        employee = Employee.objects.create(user=emp_user, department=self.department, role=self.role)
        
        url = reverse('employee-detail', args=[employee.id])
        data = {
            "user": {
                "first_name": "Chris",
                "last_name": "Zulus",
                "email": "chris@example.com", # Keeping same email
                "username": "chris_initial" # Keeping same username
            },
            "department_id": self.department.id,
            "role_id": self.role.id,
            "phone_number": "+26377680896",
            "date_hired": "2025-12-31",
            "address": "Main Campus, Gweru"
        }
        
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        emp_user.refresh_from_db()
        self.assertEqual(emp_user.first_name, "Chris")
        self.assertEqual(emp_user.last_name, "Zulus")
        
        employee.refresh_from_db()
        self.assertEqual(employee.address, "Main Campus, Gweru")
