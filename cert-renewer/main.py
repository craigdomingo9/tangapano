import logging
from datetime import datetime
import subprocess
import time
import os
from apscheduler.schedulers.blocking import BlockingScheduler
from reloader import DockerReloader

# --- Configuration (from environment variables) ---
WEBROOT_PATH = "/var/www/certbot"
RENEWAL_INTERVAL_HOURS = int(os.environ.get("RENEWAL_INTERVAL_HOURS", 12))
# 1 = Staging (default, safe for testing), 0 = Production
STAGING = os.environ.get("STAGING", "1") 
SUCCESS_PHRASE = "Congratulations, all renewals succeeded"

# --- Logging Setup ---
# Logging is already set up by reloader.py, but we grab the logger
log = logging.getLogger(__name__)

def run_renewal_check():
    """Runs 'certbot renew' and reloads Nginx if a renewal occurred."""
    log.info("--- Starting Certbot Renewal Check ---")
    
    # Set staging flag if needed
    STAGING_FLAG = ["--staging"] if STAGING == "1" else []
    
    command = [
        "certbot", "renew",
        "--webroot",
        "-w", WEBROOT_PATH,
        "--quiet",
        "--non-interactive"
    ] + STAGING_FLAG # Add the staging flag if set
    
    try:
        result = subprocess.run(
            command, 
            capture_output=True, 
            text=True, 
            check=False
        )
        
        stdout = result.stdout
        stderr = result.stderr
        
        log.info(f"Certbot stdout:\n{stdout}")
        if stderr:
            log.warning(f"Certbot stderr:\n{stderr}")

        if SUCCESS_PHRASE in stdout:
            log.info(">>> SUCCESS: Certificate was renewed. Reloading Nginx...")
            reloader = DockerReloader()
            reloader.reload_nginx()
        else:
            log.info(">>> No renewal was necessary this time.")
            
    except Exception as e:
        log.error(f"An error occurred during the renewal process: {e}")

    log.info("--- Certbot Renewal Check Finished ---")

if __name__ == "__main__":
    log.info("--- Starting Certificate Renewal Service ---")
    
    scheduler = BlockingScheduler()
    scheduler.add_job(
        run_renewal_check,
        'interval',
        hours=RENEWAL_INTERVAL_HOURS,
        jitter=3600, # Add 1 hour of jitter to avoid "thundering herd"
        next_run_time=datetime.now()
)
    
    log.info(f"Scheduled renewal check to run every {RENEWAL_INTERVAL_HOURS} hours.")
    
    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        log.info("--- Shutting Down Certificate Renewal Service ---")
        scheduler.shutdown()
