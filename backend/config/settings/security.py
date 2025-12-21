import os
import json

# Security settings
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')
DEBUG = os.environ.get('DJANGO_DEBUG') == 'True'

allowed_hosts = os.environ.get('ALLOWED_HOSTS', '')
if allowed_hosts:
    ALLOWED_HOSTS = json.loads(allowed_hosts)
else:
    ALLOWED_HOSTS = []

# Obscure the Admin URL
ADMIN_URL = 'super-secret-admin/' 

# CORS Configuration
CORS_ALLOW_CREDENTIALS = True
cors_allowed_origins = os.environ.get('CORS_ALLOWED_ORIGINS', '')
if cors_allowed_origins:
    CORS_ALLOWED_ORIGINS = json.loads(cors_allowed_origins)

if not DEBUG:
    # Security settings for behind proxy
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    CSRF_COOKIE_SECURE = True
    csrf_trusted_origins = os.environ.get('CSRF_TRUSTED_ORIGINS', '')
    if csrf_trusted_origins:
        CSRF_TRUSTED_ORIGINS = json.loads(csrf_trusted_origins)
    else:
        CSRF_TRUSTED_ORIGINS = []
