import os
from .env_file import DB_BACKUP_DIR, DB_BACKUP_KEEP_COUNT
from .utils import logger

logger = logger()

def clean_old_local_backups():
    """
    Remove old local backup files, keeping only the most recent ones.

    This function lists all backup zip files in the backup directory,
    sorts them by modification time, and deletes the oldest files
    beyond the configured keep count.
    """
    try:
        # Get all backup zip files sorted by modification time (newest first)
        backups = [
            os.path.join(DB_BACKUP_DIR, f)
            for f in os.listdir(DB_BACKUP_DIR)
            if f.startswith('db_backup_') and f.endswith('.zip')
        ]
        
        # Sort by modification time (newest first)
        backups.sort(key=lambda x: x[0], reverse=True)
        
        # Remove backups beyond the keep count
        if len(backups) > DB_BACKUP_KEEP_COUNT:
            for i in range(DB_BACKUP_KEEP_COUNT, len(backups)):
                os.remove(backups[i][1])
                if logger:
                    logger.info(f'Removed old local backup: {backups[i][2]}')
                
    except Exception as e:
        logger.error(f'Error cleaning old local backups: {e}')
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        return
