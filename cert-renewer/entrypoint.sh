#!/bin/sh
# This script runs *before* main.py
set -e

# --- Configuration (from environment variables) ---
DOMAIN=${DOMAIN}
EMAIL=${EMAIL}
# 0 = Production, 1 = Staging (for testing)
STAGING=${STAGING:-1} 

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
  echo "Error: DOMAIN and EMAIL environment variables must be set."
  exit 1
fi

CERT_PATH="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"

if [ -f "$CERT_PATH" ]; then
  echo "✅ Found existing certificate. Starting renewal scheduler."
  # If certs exist, just run the default command (CMD), which is 'python main.py'
  exec "$@"
fi

# --- No Certificate Found: Run Initial Setup ---
echo "⚠️ No certificate found. Running initial setup for $DOMAIN..."

# Set staging flag if needed
STAGING_FLAG=""
if [ "$STAGING" = "1" ]; then
  STAGING_FLAG="--staging"
  echo "Using Let's Encrypt Staging server for setup."
fi

# Request the certificate using webroot (Nginx must be running)
certbot certonly \
  --webroot \
  -w /var/www/certbot \
  -d $DOMAIN \
  -d www.$DOMAIN \
  --email $EMAIL \
  --agree-tos \
  --no-eff-email \
  --non-interactive \
  $STAGING_FLAG

if [ ! -f "$CERT_PATH" ]; then
  echo "❌ Certificate request FAILED. Check logs. Sleeping for 1 hour to prevent rate limits..."
  sleep 3600
  exit 1
fi

echo "✅ Initial certificate obtained! Reloading Nginx..."
# We have to reload Nginx *now* to load the new certs.
# We do this by instantiating the reloader class and calling the method.
python -c "from reloader import DockerReloader; DockerReloader().reload_nginx()"

echo "✅ Setup complete. Starting renewal scheduler."
# Now, run the default command (CMD) to start the renewal scheduler
exec "$@"