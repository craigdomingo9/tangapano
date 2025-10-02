#!/bin/bash

DOMAIN="tangapano.co.zw"
EMAIL="craigdomingo9@gmail.com"

echo "=== Standalone SSL Setup for $DOMAIN ==="

# Stop nginx to free up port 80
docker compose -f docker-compose.prod.yml down

# Request certificate using standalone mode
docker run -it --rm \
    -p 80:80 \
    -v $(pwd)/data/certbot/conf:/etc/letsencrypt \
    -v $(pwd)/data/certbot/www:/var/www/certbot \
    certbot/certbot certonly \
    --standalone \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d www.$DOMAIN \
    --non-interactive

if [ -f "./data/certbot/conf/live/$DOMAIN/fullchain.pem" ]; then
    echo "✅ Certificate obtained successfully!"
    
    # Create the final nginx config with SSL
    cat > nginx/nginx.conf << EOF
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }

    upstream backend {
        server backend:8000;
    }

    # HTTP to HTTPS redirect
    server {
        listen 80;
        server_name $DOMAIN www.$DOMAIN;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 301 https://\$server_name\$request_uri;
        }
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name $DOMAIN www.$DOMAIN;

        ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
        
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;

        # Security headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        location / {
            proxy_pass http://frontend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
    }
}
EOF

    echo "Starting all services with SSL..."
    docker compose -f docker-compose.prod.yml up -d
    
    echo "✅ SSL setup complete! Visit https://$DOMAIN"
else
    echo "❌ Certificate request failed"
fi