import zipfile
import os
from .utils import get_logger

logger = get_logger()


def verify_backup(zip_path):
    """Verify backup integrity"""
    try:
        with zipfile.ZipFile(zip_path, 'r') as zipf:
            # Test zip integrity
            bad_file = zipf.testzip()
            if bad_file is not None:
                raise ValueError(f"Corrupted file in zip: {bad_file}")
            
            # Check for expected backup file
            namelist = zipf.namelist()
            if not any(f.endswith('.sql') for f in namelist):
                raise ValueError("No SQL backup file found in archive")
                
        return True
    except Exception as e:
        logger.error(f"Backup verification failed: {e}")
        # Clean up corrupted backup
        if os.path.exists(zip_path):
            os.remove(zip_path)
        return False
