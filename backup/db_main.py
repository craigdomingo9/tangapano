import os
from apscheduler.schedulers.blocking import BlockingScheduler
from datetime import datetime
from db_backup.env_file import DB_BACKUP_DIR, DB_BACKUP_INTERVAL
from db_backup.wait_for_db import wait_for_database
from db_backup.upload_to_mega import upload_to_mega
from db_backup.utils import logger

logger = logger()

def main():
    """
    Main entry point for the backup service.

    - Ensures the backup directory exists.
    - Waits for the database to be ready.
    - Schedules periodic backup jobs (local or MEGA).
    - Starts the scheduler and handles graceful shutdown.
    """ 
    # Ensure backup directory exists
    os.makedirs(DB_BACKUP_DIR, exist_ok=True)
    
    # Wait for database to be ready
    wait_for_database()

    # Initialize and configure scheduler
    scheduler = BlockingScheduler()

    # Add database backup job
    scheduler.add_job(
        upload_to_mega,
        'interval',
        seconds=DB_BACKUP_INTERVAL,
        id='db_backup',
        next_run_time=datetime.now(),
        coalesce=True,
        max_instances=1
    )
    logger.info(f'Database backup service started. Will run every {DB_BACKUP_INTERVAL} seconds.')

    # Start the scheduler
    scheduler.start()


if __name__ == '__main__':
    main()
