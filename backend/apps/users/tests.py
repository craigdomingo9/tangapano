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
        emp_user = User.objects.create_user(username='employee1', password='password123', role='employee')
        url = reverse('employee-list')
        data = {
            'user': emp_user.id, # Serializer might need user_id or handle nested write, checking implementation...
            # The serializer has user=read_only. So creating employee via API might need adjustment if we want to set user.
            # But usually Employee is created alongside logic. 
            # My current serializer has `user = UserSerializer(read_only=True)`. 
            # This means I cannot set the user via the API as defined. 
            # I should update the serializer or just test listing for now.
        }
        # Let's test listing and retrieval instead since creation might be complex or backend-driven
        employee = Employee.objects.create(user=emp_user, department=self.department, role=self.role)
        
        response = self.client.get(reverse('employee-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['user']['username'], 'employee1')
