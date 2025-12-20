from rest_framework import serializers
from django.contrib.auth.models import Permission
from users.models import Role

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'codename', 'content_type']

class RoleSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)
    permission_codenames = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )

    class Meta:
        model = Role
        fields = ['id', 'name', 'description', 'permissions', 'permission_codenames', 'created_at', 'updated_at']

    def create(self, validated_data):
        codenames = validated_data.pop('permission_codenames', [])
        role = Role.objects.create(**validated_data)
        
        if codenames:
            perms = Permission.objects.filter(codename__in=codenames)
            role.permissions.set(perms)
        
        return role

    def update(self, instance, validated_data):
        codenames = validated_data.pop('permission_codenames', None)
        
        # Update scalar fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if codenames is not None:
            perms = Permission.objects.filter(codename__in=codenames)
            instance.permissions.set(perms)
            
        return instance
