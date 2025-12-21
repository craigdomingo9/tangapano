import os

DEBUG = os.environ.get('DJANGO_DEBUG') == 'True'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.ScopedRateThrottle',
    ],
}

if not DEBUG:
    REST_FRAMEWORK['DEFAULT_THROTTLE_RATES'] = {
        'listings': '100/day',
        'listing': '100/day',
        'dashboard_listings': '250/day',
        'rooms': '300/day',
        'inquiries': '100/hour',
        'user_lookup': '35/hour',
        'anon': '100/hour',  # Global anonymous throttle
        'user': '1000/hour',  # Global authenticated throttle
    }
else:
    REST_FRAMEWORK['DEFAULT_THROTTLE_RATES'] = {
        'listings': '1000/hour',
        'listing': '1000/hour',
        'dashboard_listings': '1000/hour',
        'rooms': '1000/hour',
        'inquiries': '100/hour',
        'user_lookup': '1000/hour',
        'anon': '1000/hour',  # Global anonymous throttle
        'user': '1000/hour',  # Global authenticated throttle
    }
