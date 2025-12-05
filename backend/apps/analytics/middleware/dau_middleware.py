from django.utils import timezone
from analytics.models import UserSession

class UserEngagementMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # 1. Ensure Anonymous users have a Session ID
        if not request.session.session_key:
            request.session.save()

        response = self.get_response(request)

        # 2. Filter Noise (Admin/Static)
        if request.path.startswith('/admin') or request.path.startswith('/static') or request.path.startswith('/media'):
            return response

        # 3. Track
        self.track_visit(request)
        return response

    def track_visit(self, request):
        try:
            today = timezone.now().date()
            session_key = request.session.session_key
            
            # Efficient Upsert
            # If record exists for (session+date), just inc count. If not, create.
            obj, created = UserSession.objects.get_or_create(
                session_key=session_key,
                date=today,
                defaults={
                    'user': request.user if request.user.is_authenticated else None,
                    'ip_address': self.get_client_ip(request),
                    'user_agent': request.META.get('HTTP_USER_AGENT', '')[:200]
                }
            )
            
            if not created:
                obj.hit_count += 1
                obj.save(update_fields=['hit_count', 'last_seen'])
                
                # Late Login: If they were anon but now logged in, update the user field
                if request.user.is_authenticated and not obj.user:
                    obj.user = request.user
                    obj.save(update_fields=['user'])

        except Exception:
            pass # Fail silently, analytics shouldn't break the site

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip