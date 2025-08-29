#!/bin/bash
set -e

# Run migrations first. This should always happen to keep the database schema in sync.
echo "Running migrations..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

# Define a marker file to check if the seeding has been completed.
SEEDING_DONE_FILE_DEVELOPMENT="/app/.seeding_done_development"
SEEDING_DONE_FILE_PRODUCTION="/app/.seeding_done_production"



if [ "$DJANGO_ENV" = "development" ]; then
  if [ ! -f "$SEEDING_DONE_FILE_DEVELOPMENT" ]; then
    echo "First-time setup: Seeding data..."

    echo "Seeding development data..."
    python manage.py seed_campuses
    python manage.py seed_data --landlords=150
    # Create the marker file to prevent this block from running again.
    touch "$SEEDING_DONE_FILE_DEVELOPMENT"
  fi
fi

if [ "$DJANGO_ENV" = "production" ]; then
  if [ ! -f "$SEEDING_DONE_FILE_PRODUCTION" ]; then
    echo "First-time setup: Seeding data..."

    echo "Seeding production data..."
    # TODO Seed prod data
    python manage.py seed_production_data

    # Create the marker file to prevent this block from running again.
    touch "$SEEDING_DONE_FILE_PRODUCTION"
  fi
fi


# The "$@" command ensures the original command from the Dockerfile is executed.
echo "Setup complete. Starting the application..."
exec "$@"
