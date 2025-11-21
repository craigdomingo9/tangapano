#!/bin/bash

# entrypoint.sh

# 1. Wait for Database (Postgres example)
# Adjust 'db' and '5432' if using a different database host/port
echo "Waiting for Database..."
while ! nc -z db 5432; do
  sleep 0.5
done
echo "Database started"

# 2. Wait for Elasticsearch
# We check the actual HTTP status, not just the TCP port, 
# because ES takes a few seconds to initialize internal Java processes.
echo "Waiting for Elasticsearch..."
until curl -s http://es:9200 >/dev/null; do
    sleep 2
done
echo "Elasticsearch started"

# 3. Standard Django Setup
echo "Running Migrations..."
python manage.py migrate

# 4. The Baked-in Populate Command
# --rebuild: deletes and creates the index
# -f: force (no "are you sure?" prompt)
# We run this every time to ensure consistency between code and index.
# For massive production datasets, you might move this to a separate cron job.
echo "Rebuilding Search Index..."
python manage.py search_index --rebuild -f

# 5. Start Server
# echo "Starting Server..."
# python manage.py runserver 0.0.0.0:8000