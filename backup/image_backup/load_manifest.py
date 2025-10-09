import os
import json

from image_backup.env_file import IMAGES_BACKUP_DIR
from image_backup.utils import get_logger


logger = get_logger()


def load_manifest():
    """
    Load the list of already-backed-up files from the latest manifest file.

    Returns:
        set: Set of relative file paths that have already been backed up.
    """
    if not os.path.exists(IMAGES_BACKUP_DIR):
        os.makedirs(IMAGES_BACKUP_DIR, exist_ok=True)
        return set()
    
    # Get the latest manifest file
    # Get all manifest files in the directory
    manifest_files = [f for f in os.listdir(IMAGES_BACKUP_DIR) 
                     if f.startswith("manifest_") and f.endswith('.json')]
    
    if not manifest_files:
        logger.info("No manifest file found - starting fresh")
        return set()
    
    # Sort by creation time and get latest
    manifest_files.sort(key=lambda x: os.path.getmtime(os.path.join(IMAGES_BACKUP_DIR, x)), reverse=True)
    manifest_file = os.path.join(IMAGES_BACKUP_DIR, manifest_files[0])
    
    try:
        with open(manifest_file, 'r') as f:
            data = json.load(f)
            manifest_set = set(data) if isinstance(data, list) else set()
            logger.info(f"Loaded manifest with {len(manifest_set)} entries from {manifest_files[0]}")
            return manifest_set
    except Exception as e:
        logger.error(f"Error loading manifest {manifest_file}: {e}")
        return set()
