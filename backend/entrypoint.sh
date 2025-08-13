#!/bin/sh
set -e

echo "Running migrations..."
python manage.py migrate --noinput

if [ "$DJANGO_ENV" = "development" ]; then
    echo "Seeding development data..."
    python manage.py seed_campuses
    python manage.py seed_data
fi

if [ "$DJANGO_ENV" = "production" ]; then
    echo "Seeding production data..."
    python manage.py seed_production_data
fi

exec "$@"
