import re
from django.utils import timezone
from analytics.models import UserSession

class UserEngagementMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # (Regex patterns for bots/static files remain the same)
        self.bot_pattern = re.compile(r'(bot|spider|crawler|curl|wget|google|bing|yahoo|uptime|monitor)', re.IGNORECASE)
        self.static_pattern = re.compile(r'\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|map)$', re.IGNORECASE)

    def __call__(self, request):
        # (Filtering logic remains the same: GET only, no bots, no static)
        if request.method != 'GET': return self.get_response(request)
        if request.path.startswith(('/admin', '/media', '/static', '/api/schema')): return self.get_response(request)
        if self.static_pattern.search(request.path): return self.get_response(request)
        if self.bot_pattern.search(request.META.get('HTTP_USER_AGENT', '')): return self.get_response(request)

        response = self.get_response(request)

        # Ensure session exists
        if not request.session.session_key:
            request.session.save()

        self.track_visit(request)
        return response

    def track_visit(self, request):
        try:
            today = timezone.now().date()
            session_key = request.session.session_key
            ip_address = self.get_client_ip(request)
            user_agent = request.META.get('HTTP_USER_AGENT', '')[:200]
            user = request.user if request.user.is_authenticated else None

            # --- THE HYBRID DEDUPLICATION LOGIC ---
            
            session_obj = None

            # 1. PRIORITY: Check for exact Session Key match
            # This handles normal users (Logged in or Anonymous w/ Cookies)
            session_obj = UserSession.objects.filter(
                session_key=session_key, 
                date=today
            ).first()

            # 2. FALLBACK: Check for IP + UserAgent match (For Cookie-less clients)
            # Only do this if we didn't find a session match AND the user is anonymous.
            # (We don't do this for logged-in users because they might share IPs on campus)
            if not session_obj and not user:
                session_obj = UserSession.objects.filter(
                    ip_address=ip_address,
                    user_agent=user_agent,
                    date=today,
                    user__isnull=True # Only merge anonymous records
                ).first()

            # 3. UPSERT ACTION
            if session_obj:
                # Update existing record
                session_obj.hit_count += 1
                session_obj.last_seen = timezone.now()
                # If they just logged in, link the user
                if user and not session_obj.user:
                    session_obj.user = user
                session_obj.save()
            else:
                # Create new record
                UserSession.objects.create(
                    session_key=session_key,
                    date=today,
                    user=user,
                    ip_address=ip_address,
                    user_agent=user_agent,
                    hit_count=1
                )

        except Exception:
            pass

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip