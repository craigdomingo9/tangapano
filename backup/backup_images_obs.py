import os
import zipfile
import json
import logging
from datetime import datetime
from apscheduler.schedulers.blocking import BlockingScheduler
from dotenv import load_dotenv
from mega_downloader import download_mega_file

# Load environment variables from a .env file if present.
load_dotenv()

# Configure logging to both file and console.
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("/backups/images/backup_service.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Configuration from environment variables or defaults.
IMAGES_SOURCE_DIR = os.getenv('IMAGES_SOURCE_DIR', '/app/media')
IMAGES_BACKUP_DIR = os.getenv('IMAGES_BACKUP_DIR', '/backups/images')
IMAGES_BACKUP_INTERVAL = int(os.getenv('IMAGES_BACKUP_INTERVAL', 86400))  # Daily
MEGA_EMAIL = os.getenv('MEGA_EMAIL')
MEGA_PASSWORD = os.getenv('MEGA_PASSWORD')
MEGA_IMAGES_FOLDER = os.getenv('MEGA_IMAGES_FOLDER', 'media-weekly-backups')
MANIFEST_FILE = os.path.join(IMAGES_BACKUP_DIR, 'backup_manifest.json')

def load_manifest():
    """
    Load the list of already-backed-up files from the manifest file.

    Returns:
        set: Set of relative file paths that have already been backed up.
    """
    if os.path.exists(MANIFEST_FILE):
        try:
            with open(MANIFEST_FILE, 'r') as f:
                data = json.load(f)
                # Convert to set for faster lookups
                return set(data) if isinstance(data, list) else set()
        except Exception as e:
            logger.error(f"Error loading manifest: {e}")
            return set()
    return set()

def save_manifest(manifest):
    """
    Save the updated manifest to disk.

    Args:
        manifest (set): Set of relative file paths to save.
    """
    try:
        os.makedirs(os.path.dirname(MANIFEST_FILE), exist_ok=True)
        with open(MANIFEST_FILE, 'w') as f:
            json.dump(list(manifest), f, indent=2)
        logger.info(f"Manifest saved with {len(manifest)} entries")
    except Exception as e:
        logger.error(f"Error saving manifest: {e}")

def get_weekly_zip_path(iso_year, iso_week):
    """
    Get the file path for a specific week's backup zip.

    Args:
        iso_year (int): ISO year.
        iso_week (int): ISO week number.

    Returns:
        str: Path to the weekly zip file.
    """
    weekly_zip_name = f"images_{iso_year}-W{iso_week:02d}.zip"
    weekly_dir = os.path.join(IMAGES_BACKUP_DIR, 'weekly')
    return os.path.join(weekly_dir, weekly_zip_name)

def backup_new_images():
    """
    Find new images in the source directory and add them to their respective weekly zip files.
    Updates the manifest with newly backed up files.

    Returns:
        dict: Mapping of updated zip file paths to their (year, week) tuple.
    """
    try:
        if not os.path.exists(IMAGES_SOURCE_DIR):
            logger.warning(f"Source directory does not exist: {IMAGES_SOURCE_DIR}")
            return {}
        
        processed_manifest = load_manifest()  # Set of already backed up files
        new_entries = False # Flag to indicate if any new entries were added
        files_to_add = {}  # Format: { (year, week): [list_of_filepaths] }
        total_new_files = 0  # Total number of new entries

        # Walk through source directory and find new image files.
        for root, _, files in os.walk(IMAGES_SOURCE_DIR):
            for file in files:
                # Filter for image files only
                if not file.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.tiff', '.ico', '.raw', '.heic', '.heif', '.apng', '.jfif', '.jxl', '.avif', '.tiff')):
                    continue
                
                file_path = os.path.join(root, file)
                # Use a relative path as a unique identifier for the manifest
                rel_path = os.path.relpath(file_path, IMAGES_SOURCE_DIR)

                if rel_path not in processed_manifest:
                    # This is a new file, process it
                    try:
                        file_timestamp = os.path.getctime(file_path)
                        file_dt = datetime.fromtimestamp(file_timestamp)
                        iso_year, iso_week, _ = file_dt.isocalendar()

                        # Group file by its creation week
                        week_key = (iso_year, iso_week)
                        if week_key not in files_to_add:
                            files_to_add[week_key] = []
                        files_to_add[week_key].append(file_path)
                        processed_manifest.add(rel_path)
                        new_entries = True
                        total_new_files += 1
                        logger.debug(f"Queued new file for backup: {rel_path}")
                    except Exception as e:
                        logger.error(f"Error processing file {file_path}: {e}")
                        continue

        # Add new files to their respective weekly zip archives.
        updated_zips = []
        for (year, week), file_list in files_to_add.items():
            zip_path = get_weekly_zip_path(year, week)
            os.makedirs(os.path.dirname(zip_path), exist_ok=True)

            # Use 'a' (append) mode to add files to the existing zip for that week
            mode = 'a' if os.path.exists(zip_path) else 'w'
            with zipfile.ZipFile(zip_path, mode, zipfile.ZIP_DEFLATED) as zipf:
                for file_path in file_list:  
                    rel_path_in_zip = os.path.relpath(file_path, IMAGES_SOURCE_DIR)
                    try:
                        zipf.write(file_path, rel_path_in_zip) # Add file to zip
                        logger.debug(f"Added to {os.path.basename(zip_path)}: {rel_path_in_zip}")
                    except Exception as e:
                        logger.error(f"Error adding file to zip: {e}")
            
            updated_zips.append(zip_path)
            logger.info(f"Updated backup: {os.path.basename(zip_path)} with {len(file_list)} files")

        # Save the manifest only if we found new files
        if new_entries:
            save_manifest(processed_manifest)
            logger.info(f"Backup complete. Added {total_new_files} new files across {len(files_to_add)} weeks.")
        else:
            logger.info("No new images found to backup.")
        
        return {zip_path: week_key for week_key, _ in files_to_add.items() 
                for zip_path in [get_weekly_zip_path(week_key[0], week_key[1])]}
        
    except Exception as e:
        logger.error(f"Error during image backup: {e}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        return {}

def get_or_create_folder(m, folder_name):
    """
    Get the MEGA folder ID for the given folder name, or create it if it doesn't exist.

    Args:
        m: Mega instance.
        folder_name (str): Name of the folder to get or create.

    Returns:
        str or None: Folder ID if found or created, else None.
    """
    try:
        files = m.get_files()
        
        # Look for existing folder
        for file_id, file_data in files.items():
            if isinstance(file_data, dict) and file_data.get('t') == 1:  # Folder type
                if file_data.get('a', {}).get('n') == folder_name:
                    logger.info(f"Found existing folder: {folder_name}")
                    return file_id
        
        # Create folder if it doesn't exist
        logger.info(f"Creating new folder: {folder_name}")
        folder = m.create_folder(folder_name)
        return folder[folder_name]
        
    except Exception as e:
        logger.error(f"Error with folder operation: {e}")
        return None

def upload_manifest_to_mega(m, folder_id):
    """
    Upload the manifest file to MEGA, replacing any existing version.

    Args:
        m: Mega instance.
        folder_id (str): ID of the folder to upload to.

    Returns:
        bool: True if upload succeeded, False otherwise.
    """
    try:
        if not os.path.exists(MANIFEST_FILE):
            logger.warning("Manifest file does not exist")
            return False
        
        # Check if manifest already exists in MEGA and delete old version
        files = m.get_files()
        for file_id, file_data in files.items():
            if isinstance(file_data, dict) and file_data.get('t') == 0:  # File type
                if file_data.get('p') == folder_id:  # Parent is our folder
                    filename = file_data.get('a', {}).get('n', '')
                    if filename == 'backup_manifest.json':
                        logger.info("Deleting old manifest from MEGA")
                        m.delete(file_id)
                        break
        
        # Upload new manifest
        logger.info("Uploading manifest to MEGA...")
        m.upload(MANIFEST_FILE, folder_id)
        logger.info("Manifest uploaded successfully")
        return True
        
    except Exception as e:
        logger.error(f"Error uploading manifest: {e}")
        return False

def download_manifest_from_mega(m, folder_id):
    """
    Download the manifest from MEGA if it exists, and merge with the local manifest.

    Args:
        m: Mega instance.
        folder_id (str): ID of the folder to download from.

    Returns:
        bool: True if manifest was found and merged, False otherwise.
    """
    try:
        files = m.get_files()
        
        for file_id, file_data in files.items():
            if isinstance(file_data, dict) and file_data.get('t') == 0:  # File type
                if file_data.get('p') == folder_id:  # Parent is our folder
                    filename = file_data.get('a', {}).get('n', '')
                    if filename == 'backup_manifest.json':
                        logger.info("Found manifest on MEGA, downloading...")
                        # Download to temp location
                        temp_manifest = os.path.join(IMAGES_BACKUP_DIR, 'temp_manifest.json')
                        
                        file = m.find(filename)
                        
                        if not file:
                            logger.error(f"Manifest file not found on MEGA: {filename}")
                            return None
                        
                        logger.info("Getting public link for manifest file...")
                        public_link = m.get_link(file)
                        
                        logger.info(f"Public link: {public_link}")
                        
                        # Download the file using the mega-lite download function
                        download_mega_file(public_link, temp_manifest)
                        
                        # Merge with local manifest
                        if os.path.exists(temp_manifest):
                            with open(temp_manifest, 'r') as f:
                                mega_manifest = set(json.load(f))
                            
                            local_manifest = load_manifest()
                            merged_manifest = local_manifest.union(mega_manifest)
                            save_manifest(merged_manifest)
                            
                            os.remove(temp_manifest)
                            logger.info(f"Merged manifest from MEGA. Total entries: {len(merged_manifest)}")
                            return True
        
        logger.info("No manifest found on MEGA")
        return False
        
    except Exception as e:
        logger.error(f"Error downloading manifest from MEGA: {e}")
        return False

def get_existing_mega_backups(m, folder_id):
    """
    Get a set of existing backup zip filenames in the MEGA folder.

    Args:
        m: Mega instance.
        folder_id (str): ID of the folder to check.

    Returns:
        set: Set of filenames of existing backup zips.
    """
    try:
        files = m.get_files()
        existing_backups = set()
        
        for _, file_data in files.items():
            if isinstance(file_data, dict) and file_data.get('t') == 0:  # File type
                if file_data.get('p') == folder_id:  # Parent is our folder
                    filename = file_data.get('a', {}).get('n', '')
                    if filename.startswith('images_') and filename.endswith('.zip'):
                        existing_backups.add(filename)
        
        return existing_backups
        
    except Exception as e:
        logger.error(f"Error getting existing MEGA backups: {e}")
        return set()

def upload_to_mega():
    """
    Upload weekly image backups and the manifest to MEGA.
    Only uploads new or updated zips, and always uploads the manifest.
    Does not delete any existing backup zips from MEGA.

    Returns:
        bool: True if upload succeeded, False otherwise.
    """
    if not MEGA_EMAIL or not MEGA_PASSWORD:
        logger.error("MEGA credentials not configured")
        return False
    
    try:
        from mega import Mega
        
        # Login to MEGA
        logger.info("Logging into MEGA...")
        mega = Mega()
        m = mega.login(MEGA_EMAIL, MEGA_PASSWORD)
        
        # Get or create the images backup folder
        folder_id = get_or_create_folder(m, MEGA_IMAGES_FOLDER)
        if not folder_id:
            logger.error("Could not get/create MEGA folder")
            return False
        
        # Download and merge manifest from MEGA if it exists
        download_manifest_from_mega(m, folder_id)
        
        # Perform the image backup
        updated_zips = backup_new_images()
        
        if updated_zips:
            # Get existing backups on MEGA
            existing_backups = get_existing_mega_backups(m, folder_id)
            
            # Upload only new or updated weekly backups
            weekly_dir = os.path.join(IMAGES_BACKUP_DIR, 'weekly')
            if os.path.exists(weekly_dir):
                logger.info("Uploading weekly backup to MEGA...")
                for filename in os.listdir(weekly_dir):
                    if filename.startswith('images_') and filename.endswith('.zip'):
                        logger.info(f"Found {filename}. Updated zips: {updated_zips}. Existing backups: {existing_backups}")
                        file_path = os.path.join(weekly_dir, filename)
                        if filename in updated_zips or filename not in existing_backups:
                            logger.info(f"Uploading new backup: {filename}")
                            m.upload(file_path, folder_id)
                            logger.info(f"Successfully uploaded {filename}")
                        else:
                            logger.info(f"{filename} already exists. Now updating it")
                            # Find and delete the old version
                            remote_files = m.get_files()
                            file_deleted = False
                            
                            for file_id, file_data in remote_files.items():
                                if file_data.get('a', {}).get('n', '') == filename:
                                    logger.info("Deleting previous version from MEGA")
                                    m.delete(file_id)
                                    file_deleted = True
                                    break
                            
                            if file_deleted:
                                logger.info("Previous version deleted successfully")
                            else:
                                logger.warning(f"Could not find {filename} on MEGA for update")

                            # Upload the updated version
                            logger.info(f"Uploading {filename} to MEGA...")
                            m.upload(file_path, folder_id)
                            logger.info(f"Successfully updated {filename}")
        
        # Always upload the updated manifest
        upload_manifest_to_mega(m, folder_id)
        
        logger.info("Image backup and upload complete. All backups are permanently stored.")
        return True
        
    except ImportError:
        logger.error("MEGA library not installed. Install with: pip install mega.py")
        return False
    except Exception as e:
        logger.error(f"Error during MEGA upload: {e}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        return False

if __name__ == '__main__':
    """
    Main entry point for the backup service.
    Sets up backup directories and starts the scheduler for periodic backups.
    """
    # Ensure backup directories exist
    os.makedirs(IMAGES_BACKUP_DIR, exist_ok=True)
    os.makedirs(os.path.join(IMAGES_BACKUP_DIR, 'weekly'), exist_ok=True)
    
    # Initialize and configure scheduler
    scheduler = BlockingScheduler()
    
    # Add image backup job (with or without MEGA upload)
    if MEGA_EMAIL and MEGA_PASSWORD:
        scheduler.add_job(
            upload_to_mega,
            'interval',
            seconds=IMAGES_BACKUP_INTERVAL,
            id='images_backup_mega',
            next_run_time=datetime.now(),
            coalesce=True,
            max_instances=1
        )
        logger.info(f'Image backup service started with MEGA upload. Will run every {IMAGES_BACKUP_INTERVAL} seconds.')
    else:
        scheduler.add_job(
            backup_new_images,
            'interval',
            seconds=IMAGES_BACKUP_INTERVAL,
            id='images_backup',
            next_run_time=datetime.now(),
            coalesce=True,
            max_instances=1
        )
        logger.info(f'Image backup service started (local only). Will run every {IMAGES_BACKUP_INTERVAL} seconds.')
    
    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        logger.info('Image backup service stopped.')
