import os
import json
from mega_downloader import download_mega_file
from .utils import get_logger
from .env_file import IMAGES_BACKUP_DIR
from .get_backup_week import get_backup_week

logger = get_logger()


def upload_manifest_to_mega(mega_instance, folder_id, version=None):
    """
    Upload the manifest file to MEGA, replacing any existing version.

    Args:
        mega_instance: Mega instance.
        folder_id (str): ID of the folder to upload to.

    Returns:
        bool: True if upload succeeded, False otherwise.
    """
    iso_year, iso_week = get_backup_week()
    manifest_file = os.path.join(IMAGES_BACKUP_DIR, f"manifest_{iso_year}-W{iso_week:02d}.json")
    
    try:
        if not os.path.exists(manifest_file):
            logger.warning("Manifest file does not exist")
            return False
        
        # Check if manifest already exists in MEGA, has same contents, and add version number
        files = mega_instance.get_files()
        for file_id, file_data in files.items():
            if isinstance(file_data, dict) and file_data.get('t') == 0:  # File type
                if file_data.get('p') == folder_id:  # Parent is our folder
                    filename = file_data.get('a', {}).get('n', '')
                    manifest_filename = f"manifest_{iso_year}-W{iso_week:02d}.json"
                    if filename == manifest_filename:
                        # Add version number to manifest filename
                        new_filename = f"manifest_{iso_year}-W{iso_week:02d}_v{version}.json"
                        logger.info(f"Adding version number to filename: {new_filename}")
                        
                        # rename the local file before uploading
                        os.rename(manifest_file, os.path.join(IMAGES_BACKUP_DIR, new_filename))
                        manifest_file = os.path.join(IMAGES_BACKUP_DIR, new_filename)
                        logger.info(f"Renamed {manifest_filename} to {new_filename}")
                        break 
                    
        # Upload new manifest
        logger.info("Uploading manifest to MEGA...")
        mega_instance.upload(manifest_file, folder_id)
        logger.info("Manifest uploaded successfully")
        return True
        
    except Exception as e:
        logger.error(f"Error uploading manifest: {e}")
        return False