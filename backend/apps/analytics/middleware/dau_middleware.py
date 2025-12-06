import re
from django.utils import timezone
from django.db.models import Q
from django.core.cache import cache
from analytics.models import UserSession

class UserEngagementMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        
        # 1. Expanded Bot/Noise Filter
        # Added '_next' (Next.js internals) and 'favicon' explicitly
        self.bot_pattern = re.compile(r'(bot|spider|crawler|curl|wget|google|bing|yahoo|uptime|monitor|health)', re.IGNORECASE)
        self.static_pattern = re.compile(r'\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|map|json)$', re.IGNORECASE)

    def __call__(self, request):
        # --- PHASE 1: NOISE FILTERING ---
        if request.method != 'GET': 
            return self.get_response(request)
            
        path = request.path
        
        # Skip Admin, API Schema, Static, Media
        if path.startswith(('/admin', '/media', '/static', '/api/schema', '/favicon.ico')):
            return self.get_response(request)
        
        # Skip Next.js internal build files (Common source of double-counts)
        if '_next' in path: 
            return self.get_response(request)

        # Skip Static Extensions
        if self.static_pattern.search(path):
            return self.get_response(request)

        # Skip Bots
        if self.bot_pattern.search(request.META.get('HTTP_USER_AGENT', '')):
            return self.get_response(request)

        response = self.get_response(request)

        # Ensure session exists for anonymous tracking
        if not request.session.session_key:
            try:
                request.session.save()
            except Exception:
                pass

        # --- PHASE 2: INTELLIGENT CAPTURE ---
        self.track_visit(request)
        
        return response

    def track_visit(self, request):
        try:
            today = timezone.now().date()
            session_key = request.session.session_key
            user = request.user if request.user.is_authenticated else None
            ip_address = self.get_client_ip(request)
            user_agent = request.META.get('HTTP_USER_AGENT', '')[:200]

            # ---------------------------------------------------------
            # THE FIX: Priority Lookup Logic
            # ---------------------------------------------------------
            
            session_record = None

            # PRIORITY 1: If User is Logged In, find ANY record for them today.
            # This merges their phone/laptop activity into one DAU count.
            if user:
                session_record = UserSession.objects.filter(
                    user=user, 
                    date=today
                ).first()

            # PRIORITY 2: If no User record, find by Session Key (Anonymous)
            if not session_record and session_key:
                session_record = UserSession.objects.filter(
                    session_key=session_key, 
                    date=today
                ).first()
            
            # PRIORITY 3: Fallback by IP+UA (Cookie-less deduplication)
            # Only if we still haven't found a record and it's anonymous
            if not session_record and not user:
                session_record = UserSession.objects.filter(
                    ip_address=ip_address,
                    user_agent=user_agent,
                    date=today,
                    user__isnull=True
                ).first()

            # ---------------------------------------------------------
            # EXECUTION
            # ---------------------------------------------------------
            if session_record:
                # UPDATE EXISTING
                # Logic: If it was Anonymous before but now they logged in, claim it.
                if user and not session_record.user:
                    session_record.user = user
                
                # Simple Hit Count increment
                session_record.hit_count += 1
                session_record.last_seen = timezone.now()
                session_record.save(update_fields=['hit_count', 'last_seen', 'user'])
            
            else:
                # CREATE NEW
                # We enforce creating only ONE record even if we missed the lookup
                # (Double safety against race conditions)
                UserSession.objects.create(
                    session_key=session_key,
                    user=user,
                    date=today,
                    ip_address=ip_address,
                    user_agent=user_agent,
                    hit_count=1
                )

        except Exception:
            # Swallow errors to prevent blocking the user
            pass

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip