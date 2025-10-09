import os, zipfile
from .utils import get_logger

logger = get_logger()



def restore_images(backup_paths, target_directory):
    """
    Restore images from backup files
    
    Args:
        backup_paths (list): List of paths to backup zip files
        target_directory (str): Directory to restore images to
        
    Returns:
        bool: True if restore succeeded, False otherwise
    """
    restored_count = 0
    
    for backup_path in backup_paths:
        if not os.path.exists(backup_path):
            logger.error(f"Backup file not found: {backup_path}")
            continue
            
        try:
            logger.info(f"Restoring from {os.path.basename(backup_path)}...")
            with zipfile.ZipFile(backup_path, 'r') as zipf:
                # Extract all files, preserving directory structure
                zipf.extractall(target_directory)
                file_count = len(zipf.namelist())
                restored_count += file_count
                logger.info(f"Restored {file_count} files from {os.path.basename(backup_path)}")
                
        except Exception as e:
            logger.error(f"Error restoring from {backup_path}: {e}")
            continue
    
    logger.info(f"Image restore complete. Total files restored: {restored_count}")
    return restored_count > 0
