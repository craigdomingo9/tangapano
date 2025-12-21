from django.contrib.auth import get_user_model
from django.db.models import Q
from notifications.models import NotableAction, Notification

User = get_user_model()

def log_and_notify_notable_action(action_type, description, actor=None, metadata=None):
    """
    Logs a notable action and triggers a notification to:
    - Admin users (role='admin' or is_superuser)
    - Executive employees (role='employee' and employee_profile.role.name='Executive')
    """
    if metadata is None:
        metadata = {}

    # 1. Log the action
    action = NotableAction.objects.create(
        actor=actor,
        action_type=action_type,
        description=description,
        metadata=metadata
    )

    # 2. Identify recipients
    # Recipients are admins (role='admin', is_staff, or is_superuser)
    # OR Employees with "Executive" role name
    recipients = User.objects.filter(
        Q(role='admin') | 
        Q(is_superuser=True) | 
        Q(role='employee', employee_profile__role__name__icontains='Executive')
    ).distinct()

    # 3. Create Notifications
    notifications = [
        Notification(
            recipient=user,
            title=f"Notable Action: {action.get_action_type_display()}",
            message=description,
            notification_type='info',
            category='system'
        )
        for user in recipients
    ]
    
    if notifications:
        Notification.objects.bulk_create(notifications)

    return action
