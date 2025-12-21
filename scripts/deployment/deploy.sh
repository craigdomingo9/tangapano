#!/bin/bash

# ==============================================================================
# 🚀 TANGAPANO TITANIUM DEPLOYMENT SCRIPT
# Location: ./scripts/deployment/deploy.sh
# ==============================================================================

# 1. STOP ON ERRORS
set -e

# 2. RESOLVE PROJECT ROOT
# This determines where the script is, then goes up 2 levels to find docker-compose.yml
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../" && pwd)"
LOG_FILE="$PROJECT_ROOT/deploy.log"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# Switch to the project root context immediately
cd "$PROJECT_ROOT"

# Verify we are in the right place
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Error: Could not find docker-compose.prod.yml in $PROJECT_ROOT"
    exit 1
fi

# Function to log messages
log() {
    echo "[$TIMESTAMP] $1" | tee -a "$LOG_FILE"
}

log "🔒 Starting Deployment from: $PROJECT_ROOT"

# 3. GIT UPDATE
log "📥 Pulling latest code..."
git pull origin main

# 4. BUILD IMAGES
# DOCKER_BUILDKIT=1 ensures parallel, faster builds
log "🔨 Building Docker images..."
DOCKER_BUILDKIT=1 docker compose -f docker-compose.prod.yml build backend frontend

# 5. START DATA LAYER (The Vault)
# We prioritize the data layer to ensure DBs are up before the app tries to connect
log "🗄️  Ensuring Data Layer (DB, Redis, Elastic) is up..."
docker compose -f docker-compose.prod.yml up -d db redis pgbouncer elasticsearch

# Wait a moment for Postgres/Elastic to initialize if they were restarted
sleep 10

# 6. RUN MIGRATIONS & STATIC FILES
# Note: We use 'exec -T' because we know backend is running from step 5,
# or we start it now to be safe.
log "⚙️  Running Database Migrations..."
docker compose -f docker-compose.prod.yml up -d backend
docker compose -f docker-compose.prod.yml exec -T backend python manage.py migrate --noinput

# log "🎨 Collecting Static Files..."
# This works despite read_only: true because we mounted a volume at /app/static
# docker compose -f docker-compose.prod.yml exec -T backend python manage.py collectstatic --noinput
# 7. RELOAD FRONTEND & NGINX
# We do this last to minimize downtime (Zero-Downtime Rolling Update)
log "🔄 Updating Frontend and Nginx..."
docker compose -f docker-compose.prod.yml up -d frontend nginx

# 8. RELOAD UTILITIES
# Ensure monitoring and background tasks are fresh
log "📈 Updating Monitoring & Utils..."
docker compose -f docker-compose.prod.yml up -d cert-renewer backup health-monitor

# 9. CLEANUP
log "🧹 Cleaning up unused Docker images..."
docker image prune -f

log "✅ Deployment Successfully Completed!"
echo "---------------------------------------------------"