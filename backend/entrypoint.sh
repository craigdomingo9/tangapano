#!/bin/bash

# Stop immediately if any command fails
set -e

# Default variables
DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-5432}
ES_HOST=${ES_HOST:-es} # Fixed: Use the variable, don't hardcode 'elasticsearch'
ES_PORT=${ES_PORT:-9200}

# --- OPTIMIZATION 1: Helper Function for Parallel Checks ---
# We define a function so we can run it in the background
check_service() {
    local host=$1
    local port=$2
    local name=$3
    
    echo "Checking $name at $host:$port..."
    
    # -z: scan mode, -w1: 1 second connection timeout
    while ! nc -z -w1 "$host" "$port"; do
      # --- OPTIMIZATION 2: High-Resolution Polling ---
      # Reduced sleep from 30s/5s to 1s. 
      # We catch the service the moment it wakes up.
      sleep 1
    done
    echo "$name is ready!"
}

# --- OPTIMIZATION 3: Parallel Execution ---
# Start both checks simultaneously in the background (&)
# This way, if DB takes 5s and ES takes 10s, total wait is 10s (not 15s).
check_service "$DB_HOST" "$DB_PORT" "Postgres" &
PID_DB=$!

check_service "elasticsearch" "$ES_PORT" "Elasticsearch" &
PID_ES=$!

# Wait for both background processes to finish
wait $PID_DB
wait $PID_ES

echo "All services operational."

# 3. Standard Django Setup
echo "Running Migrations..."
# python manage.py migrate

# 4. Search Index strategy
# Logic streamlined: Only run if explicitly requested to avoid boot lag
if [ "$REBUILD_SEARCH_INDEX" = "on" ]; then
    echo "Rebuilding Search Index (Env Var Set)..."
    # python manage.py search_index --rebuild -f
elif [ "$DJANGO_ENV" = "development" ]; then
    echo "Dev Mode: checking index..."
    # keeping your logic: usually dev doesn't need full rebuild on every boot 
    # unless you explicitly uncomment it.
else
    echo "Skipping Search Index Rebuild"
fi

# 5. Execute Command
exec "$@"