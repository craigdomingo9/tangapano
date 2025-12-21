import os
import socket
from datetime import timedelta
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# ImageKit Configuration
IMAGEKIT_DEFAULT_IMAGE_KIT_ENGINE = 'imagekit.engines.Pillow'
IMAGEKIT_CACHE_BACKEND = 'default'
IMAGEKIT_CACHE_TIMEOUT = timedelta(days=30).total_seconds()
IMAGEKIT_CACHEFILE_DIR = 'CACHE/images'

# Ensure the cache directory exists
os.makedirs(os.path.join(MEDIA_ROOT, 'CACHE/images'), exist_ok=True)

# Internal IPs
hostname, _, ips = socket.gethostbyname_ex(socket.gethostname())
INTERNAL_IPS = [ip[:-1] + '1' for ip in ips] + ['127.0.0.1', 'localhost']

# Use the Docker-specific toolbar callback
DEBUG_TOOLBAR_CONFIG = {
    'SHOW_TOOLBAR_CALLBACK': 'debug_toolbar.middleware.show_toolbar_with_docker',
    'SHOW_COLLAPSED': True,
    'RENDER_PANELS': True,
}

# Debug Toolbar Panels
DEBUG_TOOLBAR_PANELS = [
    'debug_toolbar.panels.history.HistoryPanel',
    'debug_toolbar.panels.versions.VersionsPanel',
    'debug_toolbar.panels.timer.TimerPanel',
    'debug_toolbar.panels.settings.SettingsPanel',
    'debug_toolbar.panels.headers.HeadersPanel',
    'debug_toolbar.panels.request.RequestPanel',
    'debug_toolbar.panels.sql.SQLPanel',
    'debug_toolbar.panels.staticfiles.StaticFilesPanel',
    'debug_toolbar.panels.templates.TemplatesPanel',
    'debug_toolbar.panels.alerts.AlertsPanel',
    'debug_toolbar.panels.cache.CachePanel',
    'debug_toolbar.panels.signals.SignalsPanel',
    'debug_toolbar.panels.redirects.RedirectsPanel',
    'debug_toolbar.panels.profiling.ProfilingPanel',
]
