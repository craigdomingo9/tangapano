import os
import json

from .utils import get_logger
from .get_backup_week import get_backup_week
from .env_file import IMAGES_BACKUP_DIR

logger = get_logger()

def save_manifest(manifest, filepath=None):
    """
    Save the updated manifest to disk.

    Args:
        manifest (set): Set of relative file paths to save.
        filepath (str, optional): Path to save the manifest file. Defaults to None.
    """
    if not filepath:
        iso_year, iso_week = get_backup_week()
        filename = f"manifest_{iso_year}-W{iso_week:02d}.json"
        filepath = os.path.join(IMAGES_BACKUP_DIR, filename)
        logger.info(f"Saving manifest to {filepath}")
    try:
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'w', encoding='utf-8') as file:
            json.dump(list(manifest), file, indent=2, separators=(',', ': '))
        logger.info(f"Manifest saved with {len(manifest)} entries")
    except Exception as e:
        logger.error(f"Error saving manifest: {e}")

