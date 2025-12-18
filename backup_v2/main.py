import os
import signal
import sys
import logging
from apscheduler.schedulers.blocking import BlockingScheduler

from systems import PostgresMegaSystem, ImageBackupSystem


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("BackupScheduler")

def graceful_exit(signum, frame):
    logger.info("Received termination signal. Shutting down scheduler...")
    sys.exit(0)

def main():
    # 1. Handle Docker Stopping (SIGTERM)
    signal.signal(signal.SIGTERM, graceful_exit)
    signal.signal(signal.SIGINT, graceful_exit)
    
    # 2. Initialize Systems
    # We load them once so they hold their config/state
    try:
        pg_system = PostgresMegaSystem()
        img_system = ImageBackupSystem()
        logger.info("✅ Systems Initialized Successfully")
    except Exception as e:
        logger.critical(f"❌ Failed to init systems: {e}")
        sys.exit(1)
    
    # 3. Setup Scheduler
    scheduler = BlockingScheduler()

    # --- JOB 1: Postgres Backup (Critical Data) ---
    # Run frequently (e.g., Every 4 hours)
    pg_interval = int(os.getenv("SCHEDULE_PG_HOURS", 4))
    scheduler.add_job(
        pg_system.run_cycle, 
        'interval', 
        hours=pg_interval,
        id='postgres_job',
        name='Postgres S3 Backup'
    )

    # --- JOB 2: Image Archival (Bulk Data) ---
    # Run less frequently (e.g., Every 12 hours)
    img_interval = int(os.getenv("SCHEDULE_IMG_HOURS", 12))
    scheduler.add_job(
        img_system.run_cycle, 
        'interval', 
        hours=img_interval,
        id='image_job',
        name='Image Weekly Archival'
    )
    
    # 5. Start the Daemon
    logger.info(f"⏳ Scheduler Started. PG: Every {pg_interval}h | IMG: Every {img_interval}h")
    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        pass
        
    
if __name__ == "__main__":
    main()


