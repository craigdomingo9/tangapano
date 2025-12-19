from rest_framework import serializers
from django.contrib.auth.models import Permission
from users.models import Employee, Department, Role
from django.contrib.auth import get_user_model

User = get_user_model()

class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'codename', 'content_type']

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'description', 'created_at', 'updated_at']

class RoleSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)
    permission_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=Permission.objects.all(), source='permissions'
    )

    class Meta:
        model = Role
        fields = ['id', 'name', 'description', 'permissions', 'permission_ids', 'created_at', 'updated_at']

class EmployeeSerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer(read_only=True)
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
        fields = ['id', 'user', 'department', 'role', 'department_id', 'role_id', 'date_hired']
