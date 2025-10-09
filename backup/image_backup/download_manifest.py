import os
import json
from datetime import datetime
from mega_downloader import download_mega_file
from .env_file import IMAGES_BACKUP_DIR, MEGA_IMAGES_FOLDER
from .get_backup_week import get_backup_week
from .utils import get_logger
from .load_manifest import load_manifest
from .save_manifest import save_manifest

logger = get_logger()

def download_manifest(mega_instance, merge=True):
    """
    Download the manifest from MEGA if it exists, and merge with the local manifest.
    
    Args:
        mega_instance: Authenticated Mega instance.
        folder_name (str): Name of the folder to download from.

    Returns:
        bool: True if download and merge succeeded, False otherwise.
    """
    
    iso_year, iso_week = get_backup_week()
    filename = f"manifest_{iso_year}-W{iso_week:02d}.json"
    
    logger.info(f"filename: {filename}")
    
    logger.info("Found manifest on MEGA, downloading...")
    
    files = mega_instance.get_files()
    
    # Get the file ID for the parent folder
    folder_id = None
    for file_id, file_data in files.items():
        if isinstance(file_data, dict) and file_data.get('t') == 1:  # File type
            if file_data.get('a', {}).get('n', '') == MEGA_IMAGES_FOLDER:  # Name
                folder_id = file_id
                break
    
    if not folder_id:
        logger.error(f"Folder not found on MEGA: {MEGA_IMAGES_FOLDER}")
        return False
    
    # Get the file ID for the latest manifest file
    manifest_files = []
    for file_id, file_data in files.items():
        if isinstance(file_data, dict) and file_data.get('t') == 0:  # File type
            if file_data.get('a', {}).get('n', '').startswith(f"manifest_{iso_year}-W{iso_week:02d}") and file_data.get('p', '') == folder_id:  # Name
                timestamp = int(file_data.get('ts', 0)) / 1000
                file_datetime = datetime.fromtimestamp(timestamp)
                manifest_files.append((file_datetime, file_id, file_data))
    
    manifest_files.sort(reverse=True)
    manifest_file = None if not manifest_files else manifest_files[0][1:]
    
    if not manifest_file:
        logger.error(f"Manifest file not found on MEGA: {filename}")
        return False
    
    logger.info("Getting public link for manifest file...")
    public_link = mega_instance.get_link(manifest_file)
    
    logger.info(f"Public link: {public_link}")
                
    # Download the file using the mega-lite download function
    temp_manifest = mega_instance.download_url(public_link, IMAGES_BACKUP_DIR)
    # temp_manifest = download_mega_file(public_link, IMAGES_BACKUP_DIR)
    logger.info(f"Downloaded manifest to {temp_manifest}")
    
    if merge:
        logger.info("Merging manifest with local manifest...")
        # Merge with local manifest
        if os.path.exists(temp_manifest):
            with open(temp_manifest, 'r') as f:
                mega_manifest = set(json.load(f))
            
            local_manifest = load_manifest()
            merged_manifest = local_manifest.union(mega_manifest)
            os.remove(temp_manifest)
            save_manifest(merged_manifest, filepath=temp_manifest)
            
            logger.info(f"Merged manifest from MEGA. Total entries: {len(merged_manifest)}")
            return True
    
    return True
    
    

