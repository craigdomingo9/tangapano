#!/bin/bash

# Set environment for cron
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

SCRIPT_NAME=$(basename "$0")
LOG_FILE="/srv/tangapano/scripts/${SCRIPT_NAME}.log"

# Ensure log directory exists and is writable
# mkdir -p "$(dirname "$LOG_FILE")"
# touch "$LOG_FILE"
chmod 644 "$LOG_FILE"

log_message() {
  local level="$1"
  local message="$2"
  echo "$(date '+%Y-%m-%d %H:%M:%S') [$level] $message" | tee -a "$LOG_FILE"
}

main() {
  log_message INFO "Script started. Restarting db."
  
  cd /srv/tangapano/ || {
    log_message ERROR "Failed to change directory to /srv/tangapano/"
    exit 1
  }
  
  # Execute docker command and ensure output is captured
  if docker compose -f docker-compose.prod.yml restart db 2>&1 | tee -a "$LOG_FILE"; then
    log_message INFO "Docker command executed successfully"
  else
    log_message ERROR "Docker command failed with exit code ${PIPESTATUS[0]}"
    exit 1
  fi
  
  log_message INFO "Script completed successfully."
}

main "$@"
