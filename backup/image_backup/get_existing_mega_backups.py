from .utils import get_logger

logger = get_logger()


def get_existing_mega_backups(m, folder_id):
    """
    Get a set of existing backup zip filenames in the MEGA folder.

    Args:
        m: Mega instance.
        folder_id (str): ID of the folder to check.

    Returns:
        set: Set of filenames of existing backup zips.
    """
    if not m:
        raise ValueError("MEGA instance required")
    if not folder_id:
        raise ValueError("Folder ID required")
    
    try:
        files = m.get_files()
        existing_backups = set()
        
        for _, file_data in files.items():
            if isinstance(file_data, dict) and file_data.get('t') == 0:  # File type
                if file_data.get('p') == folder_id:  # Parent is our folder
                    filename = file_data.get('a', {}).get('n', '')
                    if filename.startswith('images_') and filename.endswith('.zip'):
                        existing_backups.add(filename)
        
        logger.info(f"Found {len(existing_backups)} existing backups in folder {folder_id}")
        return existing_backups
        
    except Exception as e:
        logger.error(f"Error getting existing MEGA backups for folder {folder_id}: {e}")
        return set()
