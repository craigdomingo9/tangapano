#!/bin/bash

set -e

DOMAIN="tangapano.co.zw"
LOG_FILE="/srv/tangapano/scripts/ssl-renewal.log"

echo "=== Safe SSL Renewal Started: $(date) ===" | tee -a $LOG_FILE

# Pre-flight checks
echo "Running pre-flight checks..." | tee -a $LOG_FILE

# Check if domain resolves
if ! nslookup $DOMAIN &> /dev/null; then
    echo "❌ DNS resolution failed for $DOMAIN" | tee -a $LOG_FILE
    exit 1
fi

# Check if we have existing certificates
if [ ! -f "data/certbot/conf/live/$DOMAIN/fullchain.pem" ]; then
    echo "❌ No existing certificate found for $DOMAIN" | tee -a $LOG_FILE
    exit 1
fi

# Check if renewal is actually needed
DAYS_TO_EXPIRY=$(docker run --rm -v $(pwd)/data/certbot/conf:/etc/letsencrypt certbot/certbot certificates 2>/dev/null | \
    grep -A 10 "$DOMAIN" | grep "VALID" | awk '{print $5}')

if [ -z "$DAYS_TO_EXPIRY" ]; then
    echo "⚠️  Could not determine certificate expiry. Proceeding with renewal..." | tee -a $LOG_FILE
elif [ "$DAYS_TO_EXPIRY" -gt 30 ]; then
    echo "✅ Certificate is valid for $DAYS_TO_EXPIRY days. No renewal needed." | tee -a $LOG_FILE
    exit 0
else
    echo "📅 Certificate expires in $DAYS_TO_EXPIRY days. Renewing..." | tee -a $LOG_FILE
fi

# Run the renewal
echo "Starting certificate renewal..." | tee -a $LOG_FILE
./renew-ssl-standalone.sh

echo "=== Safe SSL Renewal Completed: $(date) ===" | tee -a $LOG_FILE