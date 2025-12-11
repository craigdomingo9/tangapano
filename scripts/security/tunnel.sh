#!/bin/bash

# Configuration - CHANGE THESE
VPS_USER="root"
VPS_HOST="tangapano.co.zw"
# SSH_KEY_PATH="~/.ssh/id_rsa"

echo "🔐 establishing Secure Tunnel to $VPS_HOST..."
echo "-----------------------------------------------"
echo "Mapping the following secure channels:"
echo "  📊 PgAdmin:          http://localhost:5050"
echo "  📈 Grafana:          http://localhost:9001"
echo "  🔺 Redis Commander:  http://localhost:8081"
echo "  🐘 PostgreSQL (Direct): localhost:5433 -> Remote:5432"
echo "-----------------------------------------------"
echo "⚠️  Keep this terminal OPEN to keep the tunnel active."
echo "   Press Ctrl+C to close the connection."
echo "-----------------------------------------------"

# The SSH Command
# -N : Do not execute a remote command (just forward ports)
# -L : Local Port Forwarding syntax (LocalPort:RemoteIP:RemotePort)
ssh -N \
    -L 5050:127.0.0.1:5050 \
    -L 9001:127.0.0.1:9001 \
    -L 8081:127.0.0.1:8081 \
    -L 5433:127.0.0.1:5432 \
    $VPS_USER@$VPS_HOST