import os
from apscheduler.schedulers.blocking import BlockingScheduler
from datetime import datetime
from image_backup import get_logger, upload_to_mega, clean_up_old_versions
from image_backup.env_file import IMAGES_BACKUP_DIR, IMAGES_BACKUP_INTERVAL


logger = get_logger()



def main():
    """
    Main entry point for the image backup service.
    Sets up backup directories and starts the scheduler for periodic backups.
    """
    
    # Ensure backup directories exist
    os.makedirs(IMAGES_BACKUP_DIR, exist_ok=True)
    
    # Initialize and configure scheduler
    scheduler = BlockingScheduler()
    
    # Add image backup job
    scheduler.add_job(
        upload_to_mega,
        'interval',
        seconds=IMAGES_BACKUP_INTERVAL,
        id='images_backup',
        next_run_time=datetime.now(),
        coalesce=True,
        max_instances=1
    )
    
    # Add image stale file cleanup job
    scheduler.add_job(
        clean_up_old_versions,
        'interval',
        seconds=IMAGES_BACKUP_INTERVAL * 6,
        id='images_cleanup',
        next_run_time=datetime.now(),
        coalesce=True,
        max_instances=1
    )
    logger.info(f'Image backup service started. Will run every {IMAGES_BACKUP_INTERVAL} seconds.')
    
    # Start the scheduler
    scheduler.start()

if __name__ == '__main__':
    main()
    
