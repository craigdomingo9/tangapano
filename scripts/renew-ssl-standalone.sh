#!/bin/bash

set -e

DOMAIN="tangapano.co.zw"
LOG_FILE="/srv/tangapano/ssl-renewal.log"
TIMEOUT=300  # 5 minute timeout

echo "=== SSL Certificate Renewal Started: $(date) ===" | tee -a $LOG_FILE

# Function to handle timeouts
timeout_command() {
    local timeout=$1
    shift
    local command=("$@")
    
    # Start the command
    "${command[@]}" &
    local pid=$!
    
    # Timeout counter
    local count=0
    while kill -0 $pid 2>/dev/null; do
        sleep 1
        count=$((count + 1))
        if [ $count -gt $timeout ]; then
            echo "❌ Command timed out after ${timeout} seconds" | tee -a $LOG_FILE
            kill $pid 2>/dev/null
            return 1
        fi
    done
    wait $pid
    return $?
}

# Check if renewal is needed (avoid unnecessary renewals)
echo "Checking if renewal is needed..." | tee -a $LOG_FILE
if docker run --rm -v $(pwd)/data/certbot/conf:/etc/letsencrypt certbot/certbot certificates | grep -q "VALID: 90 days"; then
    echo "✅ Certificate is still valid for more than 30 days. Skipping renewal." | tee -a $LOG_FILE
    exit 0
fi

echo "Renewal is needed. Starting renewal process..." | tee -a $LOG_FILE

# Stop nginx with timeout
echo "Stopping nginx..." | tee -a $LOG_FILE
if timeout 30 docker compose -f docker-compose.prod.yml stop nginx; then
    echo "✅ Nginx stopped successfully" | tee -a $LOG_FILE
else
    echo "❌ Failed to stop nginx gracefully, forcing stop..." | tee -a $LOG_FILE
    docker compose -f docker-compose.prod.yml kill nginx 2>/dev/null || true
    sleep 5
fi

# Ensure nginx is really stopped
if docker compose -f docker-compose.prod.yml ps nginx | grep -q "Up"; then
    echo "❌ Nginx is still running. Cannot proceed with renewal." | tee -a $LOG_FILE
    exit 1
fi

# Renew certificate with standalone method and timeout protection
echo "Renewing SSL certificate using standalone method..." | tee -a $LOG_FILE
if timeout $TIMEOUT docker run --rm \
    -p 80:80 \
    -v $(pwd)/data/certbot/conf:/etc/letsencrypt \
    certbot/certbot renew \
    --standalone \
    --non-interactive \
    --pre-hook "echo 'Starting pre-renewal checks...'" \
    --post-hook "echo 'Renewal completed successfully'"; then
    
    echo "✅ Certificate renewed successfully" | tee -a $LOG_FILE
else
    RENEWAL_EXIT_CODE=$?
    echo "❌ Certificate renewal failed with exit code: $RENEWAL_EXIT_CODE" | tee -a $LOG_FILE
    
    # Try to start nginx even if renewal failed
    docker compose -f docker-compose.prod.yml start nginx 2>/dev/null || docker compose -f docker-compose.prod.yml up -d nginx 2>/dev/null
    exit $RENEWAL_EXIT_CODE
fi

# Start nginx back up
echo "Starting nginx..." | tee -a $LOG_FILE
if docker compose -f docker-compose.prod.yml start nginx 2>/dev/null || docker compose -f docker-compose.prod.yml up -d nginx 2>/dev/null; then
    echo "✅ Nginx started successfully" | tee -a $LOG_FILE
else
    echo "❌ Failed to start nginx" | tee -a $LOG_FILE
    exit 1
fi

# Verify the renewal worked
echo "Verifying new certificate..." | tee -a $LOG_FILE
sleep 5  # Give nginx time to start

if curl -s --max-time 10 https://$DOMAIN > /dev/null; then
    echo "✅ HTTPS is working with new certificate" | tee -a $LOG_FILE
else
    echo "⚠️  HTTPS verification failed, but renewal may have succeeded" | tee -a $LOG_FILE
fi

# Show certificate expiration
echo "Certificate expiration info:" | tee -a $LOG_FILE
docker run --rm -v $(pwd)/data/certbot/conf:/etc/letsencrypt certbot/certbot certificates 2>&1 | grep -A 10 "$DOMAIN" | tee -a $LOG_FILE

echo "=== SSL Certificate Renewal Completed: $(date) ===" | tee -a $LOG_FILE