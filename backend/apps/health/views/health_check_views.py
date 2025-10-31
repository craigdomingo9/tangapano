# A high-level view of your new health_check view
from django.http import JsonResponse
from django.db import connection
from django_redis import get_redis_connection
import logging

log = logging.getLogger(__name__)

def health_check(request):
    """Performs an active check of all critical service dependencies."""
    
    checks = {
        "db_status": "ok",
        "redis_status": "ok",
    }
    is_healthy = True

    # 1. Check Database Connection
    try:
        # connection.cursor() will raise an exception if the DB is down
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
    except Exception as e:
        log.error(f"Health Check: Database check failed. {e}")
        checks["db_status"] = "error"
        is_healthy = False

    # 2. Check Redis Connection
    try:
        # get_redis_connection will raise if it can't connect
        conn = get_redis_connection("default")
        conn.ping() # .ping() is the canonical "are you there?" command
    except Exception as e:
        log.error(f"Health Check: Redis check failed. {e}")
        checks["redis_status"] = "error"
        is_healthy = False
        
    # 3. Return the overall status
    if is_healthy:
        # All checks passed
        return JsonResponse(checks, status=200)
    else:
        # One or more checks failed
        return JsonResponse(checks, status=503) # 503 Service Unavailable
