from rest_framework import serializers
from django.contrib.auth import get_user_model
from users.models import Employee, Department, Role
from .simple_user_serializer import SimpleUserSerializer
from .department_serializer import DepartmentSerializer
from .role_serializer import RoleSerializer
from notifications.utils.action_utils import log_and_notify_notable_action


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

        # Log and Notify
        log_and_notify_notable_action(
            action_type='employee_created',
            description=f"New employee created: {employee.user.get_full_name()} as {employee.role.name if employee.role else 'no role'}",
            actor=self.context['request'].user if 'request' in self.context else None,
            metadata={'employee_id': employee.id, 'user_id': user.id}
        )

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
        old_role = instance.role
        old_dept = instance.department
        
        employee = super().update(instance, validated_data)
        
        # Check for notable changes (Role or Department)
        changes = []
        if old_role != employee.role:
            changes.append(f"role changed from {old_role.name if old_role else 'None'} to {employee.role.name if employee.role else 'None'}")
        if old_dept != employee.department:
            changes.append(f"department changed from {old_dept.name if old_dept else 'None'} to {employee.department.name if employee.department else 'None'}")
            
        if changes:
            log_and_notify_notable_action(
                action_type='employee_updated',
                description=f"Employee {employee.user.get_full_name()} updated: {', '.join(changes)}",
                actor=self.context['request'].user if 'request' in self.context else None,
                metadata={'employee_id': employee.id, 'changes': changes}
            )

        return employee
