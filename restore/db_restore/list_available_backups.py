import os
from datetime import datetime
from .utils import get_logger
from .env_file import *
from mega_utils import get_files_from_folder
from .file_utils import get_filename_from_file_data


logger = get_logger()


def list_available_backups(mega_instance=None, backup_source='mega'):
    """
    List all available backups from the specified source

    Args:
        mega_instance: Mega instance
        backup_source (str): 'local' or 'mega'

    Returns:
        list: Sorted list of backup filenames with timestamps
    """
    
    backups = []
    
    if backup_source == 'local':
        if not os.path.exists(DB_BACKUP_DIR):
            logger.error(f"Backup directory {DB_BACKUP_DIR} does not exist")
            return []
            
        for filename in os.listdir(DB_BACKUP_DIR):
            if filename.startswith('db_backup_') and filename.endswith('.zip'):
                try:
                    # Extract timestamp from filename
                    timestamp_str = filename.replace('db_backup_', '').replace('.zip', '')
                    timestamp = datetime.strptime(timestamp_str, "%Y-%m-%d_%H-%M-%S")
                    backups.append((timestamp, filename))
                except ValueError:
                    continue
                
    elif backup_source == 'mega':
        try:
            
            if not mega_instance:
                logger.error("No MEGA instance provided")
                return []
            
            # Get backup files from backup folder
            logger.info(f"Getting available backups from MEGA...")
            files = get_files_from_folder(mega_instance, MEGA_DB_FOLDER, logger)
            
            if not files:
                logger.error(f"MEGA folder '{MEGA_DB_FOLDER}' not found")
                return []
            
            logger.info(f"Found {len(files)} available backups")
            
            for _, file_data in files.items():
                filename = get_filename_from_file_data(file_data)
                if filename.startswith('db_backup_') and filename.endswith('.zip'):
                    logger.info(f"Found backup file: {filename}")
                    
                    # Extract timestamp from filename
                    timestamp_str = filename.replace('db_backup_', '').replace('.zip', '')
                    
                    try:
                        timestamp = datetime.strptime(timestamp_str, "%Y-%m-%d_%H-%M-%S")
                        backups.append((timestamp, filename))
                    except ValueError:
                        continue
                    
        except Exception as e:
            logger.error(f"Error listing available backups: {e}")
            return []
    
    # Sort by year and week (newest first)
    backups.sort(key=lambda x: (x[0], x[1]), reverse=True)
    return backups

