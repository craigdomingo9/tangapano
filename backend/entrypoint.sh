#!/bin/sh
set -e

# Run migrations first. This should always happen to keep the database schema in sync.
echo "Running migrations..."
python manage.py migrate --noinput

# Define a marker file to check if the seeding has been completed.
SEEDING_DONE_FILE="/app/.seeding_done"

# Check if the marker file exists. If not, it's the first time to run the seeds.
if [ ! -f "$SEEDING_DONE_FILE" ]; then
  echo "First-time setup: Seeding data..."

  if [ "$DJANGO_ENV" = "development" ]; then
    echo "Seeding development data..."
    python manage.py seed_campuses
    python manage.py seed_data
  fi

  if [ "$DJANGO_ENV" = "production" ]; then
    echo "Seeding production data..."
    python manage.py seed_production_data
  fi

  # Create the marker file to prevent this block from running again.
  touch "$SEEDING_DONE_FILE"
fi

# The "$@" command ensures the original command from the Dockerfile is executed.
echo "Setup complete. Starting the application..."
exec "$@"
