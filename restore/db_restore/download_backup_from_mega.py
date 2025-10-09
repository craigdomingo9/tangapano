from .utils import get_logger
from .env_file import *
from mega_downloader import download_mega_file
from mega_utils import get_files_from_folder
from .file_utils import get_filename_from_file_data

logger = get_logger()


def download_backup_from_mega(mega_session, backup_filename, target_directory):
    """
    Download a specific backup from MEGA
    
    Args:
        mega_session: Mega session
        backup_filename (str): Name of the backup file to download
        target_directory (str): Directory to save the downloaded file
        
    Returns:
        str: Path to the downloaded file, or None if failed
    """
    try:
        files = get_files_from_folder(mega_session, MEGA_DB_FOLDER, logger)
        
        if not files:
            logger.error(f"MEGA folder '{MEGA_DB_FOLDER}' not found")
            return []
        
        
        for file_id, file_data in files.items():
            filename = get_filename_from_file_data(file_data)
            
            if filename != backup_filename:
                continue
            
            logger.info("Getting public link for backup file...")
            public_link = mega_session.get_link([file_id, file_data])
            
            logger.info(f"Public link: {public_link}")
            logger.info(f"Downloading {backup_filename} from MEGA...")
            download_mega_file(public_link, target_directory)
            
            logger.info(f"Backup downloaded to {os.path.join(target_directory, backup_filename)}")
            return os.path.join(target_directory, backup_filename)
        
        logger.error(f"Backup {backup_filename} not found in MEGA")
        return None
        
    except Exception as e:
        logger.error(f"Error downloading from MEGA: {e}")
        return None
