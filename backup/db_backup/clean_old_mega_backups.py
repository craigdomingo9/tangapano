from .utils import get_logger
from .env_file import DB_BACKUP_KEEP_COUNT

logger = get_logger()

def clean_old_mega_backups(mega_instance, folder_id):
    """
    Remove old backup files from the specified MEGA folder.

    - Lists all backup zip files in the MEGA folder.
    - Sorts them by timestamp.
    - Deletes the oldest files beyond the configured keep count.
    - Empties the MEGA trash to free up space.
    """
    try:
        files = mega_instance.get_files()
        # Find all backup files in the folder
        backup_files = [
            (file_data.get('ts', 0), file_id, file_data.get('a', {}).get('n', '')) # (timestamp, file_id, file_name)
            for file_id, file_data in files.items() # (file_id, file_data)
            if isinstance(file_data, dict)
            and file_data.get('t') == 0 # File type
            and file_data.get('p') == folder_id # Parent folder
            and file_data.get('a', {}).get('n', '').startswith('db_backup_')
            and file_data.get('a', {}).get('n', '').endswith('.zip')
        ]
        
        logger.info(f"Found {len(backup_files)} backup files on MEGA")
        
        # Sort by timestamp (newest first)
        backup_files.sort(reverse=True)
        
        # Remove backups beyond the keep count
        if len(backup_files) > DB_BACKUP_KEEP_COUNT:
            for i in range(DB_BACKUP_KEEP_COUNT, len(backup_files)):
                logger.info(f"Deleting old backup from MEGA: {backup_files[i][2]}")
                mega_instance.delete(backup_files[i][1])
            
            # Empty trash to free space
            mega_instance.empty_trash()
            logger.info("Emptied MEGA trash")
        
        logger.info(f"MEGA cleanup complete. Kept {min(len(backup_files), DB_BACKUP_KEEP_COUNT)} backups")
        
    except Exception as e:
        logger.error(f"Error cleaning old MEGA backups: {e}")
