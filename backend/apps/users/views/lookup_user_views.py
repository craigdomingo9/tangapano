from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.cache import cache
from django.db.models import Q
from users.models import User


class UserLookupView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_scope = "user_lookup"

    def get(self, request, *args, **kwargs):
        """
        Check if a user exists by username or email.
        """
        username = request.query_params.get('username', None)
        email = request.query_params.get('email', None)

        if not username and not email:
            return Response(
                {"error": "Please provide either a username or an email."}, 
                status=400
            )

        cache_key = None
        user_exists = False
        field = None
        
        if username:
            cache_key = f"user_exists_username_{username}"
            cached_result = cache.get(cache_key)
            
            if cached_result is not None:
                return self._format_response(cached_result['exists'], cached_result['field'])
            
            # Use database query instead of iterating through all users
            user_exists = User.objects.filter(username=username).exists()
            field = "username" if user_exists else None
            
            # Cache the result for 7 days
            if user_exists:
                cache.set(cache_key, {'exists': True, 'field': field}, timeout=60*60*24*7)
        
        if email and not user_exists:  # Only check email if username didn't exist
            cache_key = f"user_exists_email_{email}"
            cached_result = cache.get(cache_key)
            
            if cached_result is not None:
                return self._format_response(cached_result['exists'], cached_result['field'])
            
            user_exists = User.objects.filter(email__iexact=email).exists()
            field = "email" if user_exists else None
            
            if user_exists:
                cache.set(cache_key, {'exists': True, 'field': field}, timeout=60*60*24*7)

        return self._format_response(user_exists, field)

    def _format_response(self, exists, field):
        """Helper method to format consistent responses."""
        if exists:
            messages = {
                "username": "That username is taken. Try another.",
                "email": "That email already exists."
            }
            return Response({
                "exists": True,
                "field": field,
                "message": messages.get(field, "User already exists.")
            }, status=200)
        
        return Response({"exists": False}, status=200)
