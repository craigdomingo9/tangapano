#!/bin/bash

# ==============================================================================
# 🛡️ SERVER HARDENING SCRIPT (Phase 1)
# ==============================================================================
# This script automates Kernel hardening, UFW firewall setup, and basic tool install.
# Geared for: Ubuntu / Debian servers.
# ==============================================================================

# --- CONFIGURATION ---
SSH_PORT=22              # CHANGE THIS if you use a custom SSH port
VPN_PORT=51820           # Default WireGuard port (change if needed)
ALLOW_VPN=false          # Set to true if you want to open the VPN port immediately

# --- CHECK ROOT ---
if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run as root (use sudo)"
  exit
fi

echo "🚀 Starting Fortress Hardening..."

# ------------------------------------------------------------------------------
# 1. SYSTEM UPDATES
# ------------------------------------------------------------------------------
echo "📦 Updating system packages..."
apt-get update && apt-get upgrade -y
apt-get install -y ufw fail2ban curl gnupg2

# ------------------------------------------------------------------------------
# 1.5 AUTOMATIC UPDATES
# ------------------------------------------------------------------------------
echo "🔄 Enabling Automatic Security Updates..."
apt-get install -y unattended-upgrades
dpkg-reconfigure -f noninteractive unattended-upgrades
echo "✅ Auto-updates enabled."

# ------------------------------------------------------------------------------
# 2. KERNEL HARDENING (sysctl)
# ------------------------------------------------------------------------------
echo "🔒 Applying Kernel Hardening rules..."

SYSCTL_CONF="/etc/sysctl.conf"
BACKUP_CONF="/etc/sysctl.conf.bak.$(date +%F)"

# Backup existing config
cp $SYSCTL_CONF $BACKUP_CONF
echo "   (Backup saved to $BACKUP_CONF)"

# Append hardening rules
cat <<EOF >> $SYSCTL_CONF

# --- FORTRESS HARDENING START ---
# IP Spoofing Protection
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Ignore ICMP Echo Requests (Block Pings - Optional, un-comment to enable)
# net.ipv4.icmp_echo_ignore_all = 1

# Ignore Broadcast Requests (Smurf Attacks)
net.ipv4.icmp_echo_ignore_broadcasts = 1

# Disable Source Packet Routing
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0

# Block SYN Floods
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 2048
net.ipv4.tcp_fin_timeout = 15
net.ipv4.tcp_keepalive_time = 300

# Log Martians (Packets with impossible addresses)
net.ipv4.conf.all.log_martians = 1
# --- FORTRESS HARDENING END ---
EOF

# Apply changes
sysctl -p
echo "✅ Kernel rules applied."

# ------------------------------------------------------------------------------
# 3. FIREWALL SETUP (UFW)
# ------------------------------------------------------------------------------
echo "🧱 Configuring Firewall (UFW)..."

# Reset UFW to default state
ufw --force reset

# Default Policies
ufw default deny incoming
ufw default allow outgoing

# Allow Critical Ports
echo "   Allowing SSH on port $SSH_PORT..."
ufw allow $SSH_PORT/tcp

echo "   Allowing HTTP (80) & HTTPS (443)..."
ufw allow 80/tcp
ufw allow 443/tcp

if [ "$ALLOW_VPN" = true ]; then
    echo "   Allowing VPN on port $VPN_PORT..."
    ufw allow $VPN_PORT/udp
fi

# Enable UFW
echo "⚠️  Enabling UFW. If you changed SSH port and didn't update the script, you may be locked out."
ufw --force enable

echo "✅ Firewall is active."

# ------------------------------------------------------------------------------
# 4. FAIL2BAN SETUP
# ------------------------------------------------------------------------------
echo "👮 Configuring Fail2Ban..."

# Create a local jail config to avoid overwriting defaults
cat <<EOF > /etc/fail2ban/jail.local
[sshd]
enabled = true
port = $SSH_PORT
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
EOF

systemctl restart fail2ban
systemctl enable fail2ban
echo "✅ Fail2Ban is running protecting SSH."

# ------------------------------------------------------------------------------
# 5. CROWDSEC INSTALLATION
# ------------------------------------------------------------------------------
echo "🕵️  Installing CrowdSec (Intrusion Detection)..."

# Add repository
curl -s https://install.crowdsec.net | bash

# Install agent
apt-get install -y crowdsec

echo "✅ CrowdSec installed. It will detect attacks automatically."

# ------------------------------------------------------------------------------
# FINAL STATUS
# ------------------------------------------------------------------------------
echo " "
echo "🎉 SERVER HARDENING COMPLETE!"
echo "-----------------------------------------------------"
echo "1. UFW Status:"
ufw status verbose
echo "-----------------------------------------------------"
echo "2. Kernel Hardening:"
sysctl net.ipv4.tcp_syncookies
echo "-----------------------------------------------------"
echo "👉 NEXT STEP: Reboot your server to ensure all kernel changes take full effect."