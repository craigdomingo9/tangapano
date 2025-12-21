import os

DATABASES = {
    'default': {
        'ENGINE': 'django_prometheus.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_DB', 'postgres'),
        'USER': os.environ.get('POSTGRES_USER', 'postgres'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD', 'root'),
        'HOST': os.environ.get('PG_BOUNCER_HOST', 'pgbouncer'),
        'PORT': os.environ.get('PG_BOUNCER_PORT', 6432),
        'CONN_MAX_AGE': 0,
    }
}

ELASTICSEARCH_DSL = {
    'default': {
        'hosts': f"http://{os.environ.get('ELASTICSEARCH_HOST', 'localhost')}:9200",
        'http_auth': ('elastic', os.environ.get('ELASTIC_PASSWORD')),
        'request_timeout': 60
    },
}
