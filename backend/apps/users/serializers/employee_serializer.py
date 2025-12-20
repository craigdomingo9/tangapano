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
        
        current_user = self.instance.user if self.instance else None

        if username:
            # If new user OR (updating and username changed)
            if not current_user or current_user.username != username:
                if User.objects.filter(username=username).exists():
                    raise serializers.ValidationError({"username": "A user with this username already exists."})
            
        if email:
            # If new user OR (updating and email changed)
            if not current_user or current_user.email != email:
                if User.objects.filter(email=email).exists():
                    raise serializers.ValidationError({"email": "A user with this email already exists."})
            
        return value

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        password = user_data.pop('password', None)
        
        user = User.objects.create_user(password=password, is_staff=True, **user_data)
        user.role = 'employee'
        user.save()

        employee = Employee.objects.create(user=user, **validated_data)
        return employee

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        
        if user_data:
            user = instance.user
            user_has_changes = False
            
            password = user_data.pop('password', None)
            if password:
                user.set_password(password)
                user_has_changes = True

            for attr, value in user_data.items():
                if getattr(user, attr) != value:
                    setattr(user, attr, value)
                    user_has_changes = True
            
            if user_has_changes:
                user.save()

        # Update employee fields
        return super().update(instance, validated_data)
