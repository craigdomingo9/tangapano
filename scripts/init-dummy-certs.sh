#!/bin/bash
# This script generates dummy certificates to allow Nginx to start.
# It is non-destructive and will not overwrite your nginx.conf.

# --- CONFIGURATION (!!! EDIT THESE !!!) ---
DOMAIN="tangapano.co.zw"
EMAIL="craigdomingo9@gmail.com"
# --------------------------------------------

DATA_PATH="./data/certbot"
CONF_PATH="$DATA_PATH/conf/live/$DOMAIN"

if [ -d "$DATA_PATH" ]; then
  echo ">>> Found existing cert data at $DATA_PATH. Skipping dummy cert creation."
  exit 0
fi

if [ ! -f "./nginx/nginx.conf" ]; then
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "!!! ERROR: ./nginx/nginx.conf not found!                     !!!"
  echo "!!! Please create your nginx.conf *first* before running this. !!!"
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  exit 1
fi

echo ">>> Creating dummy certificate for $DOMAIN..."
mkdir -p "$CONF_PATH"
openssl req -x509 -nodes -newkey rsa:4096 -days 365 \
  -keyout "$CONF_PATH/privkey.pem" \
  -out "$CONF_PATH/fullchain.pem" \
  -subj "/CN=localhost"

echo "✅ Dummy certs created."
echo "You can now run 'docker compose up -d'."