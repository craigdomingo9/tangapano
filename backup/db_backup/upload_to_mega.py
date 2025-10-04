import os
import time
from mega_utils import login_mega
from mega_utils import get_or_create_folder
from .utils import logger
from .perform_backup import perform_backup
from .clean_old_mega_backups import clean_old_mega_backups
from .env_file import MEGA_EMAIL, MEGA_PASSWORD, MEGA_DB_FOLDER
from requests.exceptions import ConnectionError, Timeout, RequestException


logger = logger()

def upload_to_mega():
    """
    Upload the latest database backup to MEGA cloud storage.

    - Creates a new backup.
    - Logs in to MEGA.
    - Uploads the backup to the specified folder.
    - Cleans up old backups on MEGA.
    Handles retries for network errors.
    Returns True on success, False otherwise.
    """
    
    if not MEGA_EMAIL or not MEGA_PASSWORD:
        logger.error("MEGA credentials not configured")
        return False
    
    mega_instance = login_mega(MEGA_EMAIL, MEGA_PASSWORD, logger)
    
    if not mega_instance:
        logger.error("Failed to login to MEGA")
        return False
    
    # First create the backup
    zip_path = perform_backup()
    if not zip_path:
        logger.error("Failed to create backup")
        return False
    
    logger.info(f"zip_path: {zip_path}")
    
    max_retries = 5
    retry_delay = 10
    
    for attempt in range(max_retries):
        try:
            # Get or create the DB backup folder
            folder_id = get_or_create_folder(mega_instance, MEGA_DB_FOLDER)
            
            if folder_id:
                logger.info(f"Uploading {os.path.basename(zip_path)} to MEGA folder {MEGA_DB_FOLDER}...")
                
                # Upload to the specific folder
                file = mega_instance.upload(zip_path, folder_id)
                if not file:
                    logger.error(f"Failed to upload {os.path.basename(zip_path)} to MEGA folder {MEGA_DB_FOLDER}")
                    return False
                
                logger.info(f"Successfully uploaded {os.path.basename(zip_path)} to MEGA folder {MEGA_DB_FOLDER}")
                
                # Clean up old MEGA backups
                clean_old_mega_backups(mega_instance, folder_id)
                
            else:
                logger.error("Could not get/create MEGA folder")
                return False
            
            return True
        except (ConnectionError, Timeout, RequestException) as e:
            logger.warning(f"Network error during MEGA upload (attempt {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                logger.info(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
                retry_delay *= 2
            else:
                logger.error("All MEGA upload attempts failed")
                return False
            
        except Exception as e:
            logger.error(f"Unexpected error during MEGA upload: {e}")
            import traceback
            logger.error(f"Full error: {traceback.format_exc()}")
            return False
    
    
    
    
    