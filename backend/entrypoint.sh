#!/bin/bash

# If any command fails, stop the script immediately (Good for safety)
set -e

# Define defaults but allow overrides via Env Vars
# (Useful if you change service names in docker-compose)
DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-5432}
ES_HOST=${ES_HOST:-es}
ES_PORT=${ES_PORT:-9200}

# 1. Wait for Database
echo "Waiting for Postgres at $DB_HOST:$DB_PORT..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 5
done
echo "Postgres started"

# 2. Wait for Elasticsearch
echo "Waiting for Elasticsearch connection..."
# Switch from 'curl' to 'nc' (netcat)
# -z: scan for listening daemons, without sending data
# -v: verbose (so you see what's happening in logs)
while ! nc -z -v elasticsearch 9200; do
  echo "Elasticsearch (es:9200) is not reachable yet. Retrying..."
  sleep 2
done
echo "Elasticsearch started and reachable"



# 3. Standard Django Setup
echo "Running Migrations..."
python manage.py migrate

# 4. Search Index (Conditional)
# Only rebuild if we specifically ask for it, OR if we are in Development mode.
# Assuming you have a DEBUG env var (standard in Django)
# if [ "$REBUILD_SEARCH_INDEX" = "on" ]; then
    # echo "Rebuilding Search Index (Forced via Env Var)..."
    # python manage.py search_index --rebuild -f
# el
if [ "$DJANGO_ENV" = "development" ]; then
    echo "Development mode detected: Rebuilding Search Index..."
    # python manage.py search_index --rebuild -f
else
    echo "Skipping Search Index Rebuild (Production Safety)"
fi

# 5. Hand over to the CMD
# This executes the command passed in the Dockerfile (runserver or gunicorn)
# replacing the current process with the server process (PID 1).
exec "$@"
