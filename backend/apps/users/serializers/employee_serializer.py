from rest_framework import serializers
from django.contrib.auth import get_user_model
from users.models import Employee, Department, Role
from .simple_user_serializer import SimpleUserSerializer
from .department_serializer import DepartmentSerializer
from .role_serializer import RoleSerializer

User = get_user_model()

class EmployeeSerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer()
    department = DepartmentSerializer(read_only=True)
    role = RoleSerializer(read_only=True)
    
    department_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=Department.objects.all(), source='department', required=False, allow_null=True
    )
    role_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=Role.objects.all(), source='role', required=False, allow_null=True
    )

    class Meta:
        model = Employee
        fields = ['id', 'user', 'department', 'role', 'department_id', 'role_id', 'date_hired', 'phone_number', 'address']

    def validate_user(self, value):
        username = value.get('username')
        email = value.get('email')
        
        user_qs = User.objects.all()
        # If updating, exclude the current employee's user from the check
        if self.instance and self.instance.user:
            user_qs = user_qs.exclude(pk=self.instance.user.pk)
        
        if username and user_qs.filter(username=username).exists():
            raise serializers.ValidationError({"username": "A user with this username already exists."})
            
        if email and user_qs.filter(email=email).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists."})
            
        return value

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        
        # Generate dynamic password based on first_name
        first_name = user_data.get('first_name', 'Employee')
        import random
        import string
        
        base = first_name.capitalize()
        digits = ''.join(random.choices(string.digits, k=4))
        specials = ''.join(random.choices("!@#$%^&*", k=2))
        generated_password = f"{base}{digits}{specials}"
        
        user = User.objects.create_user(password=generated_password, **user_data)
        user.role = 'employee'
        user.save()

        employee = Employee.objects.create(user=user, **validated_data)
        return employee

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        
        if user_data:
            user = instance.user
            user_has_changes = False
            for attr, value in user_data.items():
                if getattr(user, attr) != value:
                    setattr(user, attr, value)
                    user_has_changes = True
            
            if user_has_changes:
                user.save()

        # Update employee fields
        return super().update(instance, validated_data)
