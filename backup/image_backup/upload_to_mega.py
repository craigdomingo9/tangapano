import os
from mega_utils import login_mega
from mega_utils.get_or_create_folder import get_or_create_folder
from .env_file import MEGA_EMAIL, MEGA_PASSWORD, MEGA_IMAGES_FOLDER, IMAGES_BACKUP_DIR
from .utils import get_logger
from .perform_backup import perform_backup
from .download_manifest import download_manifest
from .get_existing_mega_backups import get_existing_mega_backups
from .upload_manifest_to_mega import upload_manifest_to_mega


logger = get_logger()


def upload_to_mega():
    """
    Upload weekly image backups and the manifest to MEGA.
    Only uploads new or updated zips, and always uploads the manifest.
    Does not delete any existing backup zips from MEGA. Only appends a version number.

    Returns:
        bool: True if upload succeeded, False otherwise.
    """
    
    if not MEGA_EMAIL or not MEGA_PASSWORD:
        logger.error("MEGA credentials not configured")
        return False

    mega_instance = login_mega(MEGA_EMAIL, MEGA_PASSWORD, logger)

    if not mega_instance:
        logger.error("Failed to login to MEGA")
        return False
        
    # Get or create the images backup folder
    folder_id = get_or_create_folder(mega_instance, MEGA_IMAGES_FOLDER)
    if not folder_id:
        logger.error("Could not get/create MEGA folder")
        return False
    
    # Download and merge manifest from MEGA if it exists
    _ = download_manifest(mega_instance)
    
    # First create the backup
    updated_zips = perform_backup()
    if not updated_zips:
        return False
    
    logger.info(f"zip_path: {updated_zips}")
    
    existing_backups = get_existing_mega_backups(mega_instance, folder_id)
    logger.info(f"existing_backups: {existing_backups}")
    
    # Upload only new or updated weekly backups
    uploaded_successfully = False
    backup_version = None
    
    # Get basenames of updated zips for comparison
    updated_basenames = {os.path.basename(path) for path in updated_zips.keys()}
    
    weekly_dir = os.path.join(IMAGES_BACKUP_DIR, 'weekly')
    if os.path.exists(weekly_dir):
        logger.info("Uploading weekly backup to MEGA...")
        for filename in os.listdir(weekly_dir):
            if filename.startswith('images_') and filename.endswith('.zip'):
                logger.info(f"Found {filename}. Updated zips: {updated_zips}. Existing backups: {existing_backups}")
                file_path = os.path.join(weekly_dir, filename)
                
                if filename in updated_basenames and filename not in existing_backups:
                    logger.info(f"Uploading {filename} to MEGA...")                    
                    mega_instance.upload(file_path, folder_id)
                    logger.info(f"Uploaded {filename} to MEGA")
                    uploaded_successfully = True
                
                elif filename in existing_backups:
                    # Add version number to filename
                    backup_version = 1
                    new_filename = f"{filename.split('.')[0]}_v{backup_version}.zip"
                    logger.info(f"Filename {filename} already exists in MEGA. Adding version number... v{backup_version}")
                    while new_filename in existing_backups:
                        backup_version += 1
                        new_filename = f"{filename.split('.')[0]}_v{backup_version}.zip"
                    
                    logger.info(f"{filename}. Adding version number: v{backup_version} to filename: {new_filename}")
                    logger.info(f"Renamed {filename} to {new_filename}")
                    
                    if os.path.isfile(file_path):
                        logger.info(f"Uploading {filename} to MEGA...")                    
                        mega_instance.upload(file_path, folder_id, dest_filename=new_filename)
                        uploaded_successfully = True
                    else:
                        logger.error(f"File {file_path} does not exist.")
                        return False
                    
                    logger.info(f"Uploaded {new_filename} to MEGA")
                
    # Upload the manifest
    if not uploaded_successfully:
        return False
    
    logger.info("Uploading manifest to MEGA...")
    upload_manifest_to_mega(mega_instance, folder_id, version=backup_version)
    
    
    logger.info("Image backup and upload complete. All backups are permanently stored.")
    return True


    