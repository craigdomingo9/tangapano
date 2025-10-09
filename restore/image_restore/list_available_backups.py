import os
from .env_file import *
from .utils import get_logger
from mega_utils import get_files_from_folder
from .file_utils import get_filename_from_file_data, get_year_week_from_filename


logger = get_logger()

def list_available_backups(mega_instance=None, backup_source='local'):
    """
    List all available backups from the specified source
    
    Args:
        backup_source (str): 'local' or 'mega'
    
    Returns:
        list: Sorted list of backup filenames with week information
    """
    backups = []
    
    if backup_source == 'local':
        weekly_dir = os.path.join(IMAGES_BACKUP_DIR, 'weekly')
        if not os.path.exists(weekly_dir):
            logger.error(f"Weekly backup directory does not exist: {weekly_dir}")
            return []
            
        for filename in os.listdir(weekly_dir):
            if filename.startswith('images_') and filename.endswith('.zip'):
                # Extract year and week from filename
                try:
                    parts = filename.replace('images_', '').replace('.zip', '').split('-')
                    year = int(parts[0])
                    week = int(parts[1].replace('W', ''))
                    backups.append((year, week, filename))
                except (ValueError, IndexError):
                    continue
                    
    elif backup_source == 'mega':
        try:
            # Verify MEGA instance
            if not mega_instance:
                logger.error("No MEGA instance provided")
                return []
            
            files = get_files_from_folder(mega_instance, MEGA_IMAGES_FOLDER, logger)
            
            if not files:
                logger.error(f"MEGA folder '{MEGA_IMAGES_FOLDER}' not found")
                return []
            
            
            backups_map = {}
            for file_id, file_data in files.items():
                filename = get_filename_from_file_data(file_data)
                if (filename.startswith('images_') and 
                    filename.endswith('.zip')):
                    
                    # Extract year and week from filename
                    try:
                        logger.info(f"Found backup file: {filename}")
                        year, week = get_year_week_from_filename(filename)
                        backups.append((year, week, filename))
                    
                        # This will add a new entry or update an existing one for the given year and week.
                        backups_map[(year, week)] = filename
                        
                    except (ValueError, IndexError):
                        continue
            backups = [(year, week, filename) for (year, week), filename in backups_map.items()]
            logger.info(f"Found {len(backups)} backups")
            logger.info(f"Backups: {backups}")
        except Exception as e:
            logger.error(f"Error listing MEGA backups: {e}")
    
    # Sort by year and week (newest first)
    backups.sort(key=lambda x: (x[0], x[1]), reverse=True)
    return backups
