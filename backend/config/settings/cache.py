import os
from datetime import timedelta

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": f"redis://:{os.environ.get('REDIS_PASSWORD')}@redis:6379",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    },
}

CACHE_TTL = timedelta(days=1).total_seconds()  # 1 day
