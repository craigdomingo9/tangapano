from django.core.management.base import BaseCommand
from users.models import Role
from django.contrib.auth.models import Permission
from users.serializers.role_serializer import RoleSerializer

class Command(BaseCommand):
    help = 'Verify Role Serializer Codenames'

    def handle(self, *args, **kwargs):
        # Setup
        Role.objects.all().delete()
        
        # Ensure we have some permissions
        p1 = Permission.objects.filter(codename='add_user').first()
        if not p1:
            print("FAILURE: System missing 'add_user' permission")
            return

        print("\n--- Testing Role Create with Codenames ---")
        data = {
            "name": "Manager",
            "description": "Test Role",
            "permission_codenames": ["add_user", "change_user"]
        }
        
        ser = RoleSerializer(data=data)
        if ser.is_valid():
            role = ser.save()
            print(f"SUCCESS: Created Role '{role.name}'")
            perms = role.permissions.values_list('codename', flat=True)
            print("Permissions:", list(perms))
            
            if "add_user" in perms:
                print("VERIFIED: add_user permission present")
            else:
                print("FAILURE: add_user permission MISSING")
        else:
            print("FAILURE: Serializer errors:", ser.errors)

        print("\n--- Testing Role Update with Codenames ---")
        update_data = {
            "permission_codenames": ["delete_user"] # Should replace existing
        }
        ser_upd = RoleSerializer(instance=role, data=update_data, partial=True)
        if ser_upd.is_valid():
            role = ser_upd.save()
            perms = role.permissions.values_list('codename', flat=True)
            print("Updated Permissions:", list(perms))
            if "delete_user" in perms and "add_user" not in perms:
                print("VERIFIED: Permissions replaced correctly")
            else:
                print("FAILURE: Permissions update logic incorrect")
        else:
            print("FAILURE: Update errors:", ser_upd.errors)
