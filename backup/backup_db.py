import os
import time
import subprocess
import zipfile
import logging
from datetime import datetime
from apscheduler.schedulers.blocking import BlockingScheduler
from dotenv import load_dotenv
from requests.exceptions import ConnectionError, Timeout, RequestException

# Load environment variables from a .env file if present
load_dotenv()

# Configure logging to file and console
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("/backups/db_backup_service.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Configuration from environment variables
POSTGRES_HOST = os.getenv('POSTGRES_HOST', 'db')
POSTGRES_USER = os.getenv('POSTGRES_USER', 'postgres')
POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD')
POSTGRES_DB = os.getenv('POSTGRES_DB')
DB_BACKUP_DIR = os.getenv('DB_BACKUP_DIR', '/backups/db')
DB_BACKUP_INTERVAL = int(os.getenv('DB_BACKUP_INTERVAL', 14400))  # 4 hours
DB_BACKUP_KEEP_COUNT = int(os.getenv('DB_BACKUP_KEEP_COUNT', 28))
MEGA_EMAIL = os.getenv('MEGA_EMAIL')
MEGA_PASSWORD = os.getenv('MEGA_PASSWORD')
MEGA_DB_FOLDER = os.getenv('MEGA_DB_FOLDER', 'db-daily-backups')

def wait_for_database():
    """
    Wait until the PostgreSQL database becomes available.

    This function repeatedly checks the database readiness using pg_isready.
    It blocks until the database is ready to accept connections.
    """
    logger.info("Waiting for database to be ready...")
    while True:
        try:
            env = os.environ.copy()
            env['PGPASSWORD'] = POSTGRES_PASSWORD
            subprocess.run(
                ['pg_isready', '-h', POSTGRES_HOST, '-U', POSTGRES_USER],
                check=True,
                env=env,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
            logger.info("Database is ready. Starting backup service.")
            break
        except subprocess.CalledProcessError:
            logger.info("Database not ready yet, retrying in 5 seconds...")
            time.sleep(5)

def perform_backup():
    """
    Execute a PostgreSQL database backup and compress it.

    - Runs pg_dump to create a SQL backup.
    - Compresses the backup into a zip file.
    - Removes the uncompressed SQL file.
    - Cleans up old local backups.
    Returns the path to the created zip file, or None on failure.
    """
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    backup_name = f"backup_{timestamp}.sql"
    backup_path = os.path.join(DB_BACKUP_DIR, backup_name)
    
    # Ensure backup directory exists
    os.makedirs(DB_BACKUP_DIR, exist_ok=True)
    
    # Set environment for subprocess
    env = os.environ.copy()
    env['PGPASSWORD'] = POSTGRES_PASSWORD
    
    try:
        # Execute pg_dump
        logger.info(f"Starting database backup: {backup_name}")
        with open(backup_path, 'w') as f:
            subprocess.run([
                'pg_dump',
                '-h', POSTGRES_HOST,
                '-U', POSTGRES_USER,
                '-d', POSTGRES_DB,
                '--clean',
                '--if-exists'
            ], stdout=f, env=env, check=True)
        
        logger.info(f'Backup created successfully: {backup_name}')
        
        # Create zip of the backup
        zip_filename = f"db_backup_{timestamp}.zip"
        zip_path = os.path.join(DB_BACKUP_DIR, zip_filename)
        
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            zipf.write(backup_path, os.path.basename(backup_path))
        
        logger.info(f"Created DB backup zip: {zip_filename}")
        
        # Remove the uncompressed SQL file
        os.remove(backup_path)
        
        # Clean up old local backups
        clean_old_local_backups()
        
        return zip_path
        
    except subprocess.CalledProcessError as e:
        logger.error(f'Backup failed with error: {e}')
        return None

def clean_old_local_backups():
    """
    Remove old local backup files, keeping only the most recent ones.

    This function lists all backup zip files in the backup directory,
    sorts them by modification time, and deletes the oldest files
    beyond the configured keep count.
    """
    try:
        # Get all backup zip files sorted by modification time (newest first)
        backups = [
            os.path.join(DB_BACKUP_DIR, f)
            for f in os.listdir(DB_BACKUP_DIR)
            if f.startswith('db_backup_') and f.endswith('.zip')
        ]
        
        # Sort by modification time (newest first)
        backups.sort(key=lambda x: x[0], reverse=True)
        
        # Remove backups beyond the keep count
        if len(backups) > DB_BACKUP_KEEP_COUNT:
            for i in range(DB_BACKUP_KEEP_COUNT, len(backups)):
                os.remove(backups[i][1])
                logger.info(f'Removed old local backup: {backups[i][2]}')
                
    except Exception as e:
        logger.error(f'Error cleaning old local backups: {e}')

def get_or_create_folder(m, folder_name):
    """
    Get the MEGA folder ID for the given folder name, or create it if it doesn't exist.

    Args:
        m: Authenticated Mega instance.
        folder_name: Name of the folder to find or create.

    Returns:
        The folder ID if found or created, else None.
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
    
    max_retries = 3
    retry_delay = 10
    
    # First create the backup
    zip_path = perform_backup()
    if not zip_path:
        logger.error("Failed to create backup")
        return False
    
    for attempt in range(max_retries):
        try:
            from mega import Mega
            
            logger.info(f"Attempting MEGA login (attempt {attempt + 1}/{max_retries})...")
            mega = Mega()
            m = mega.login(MEGA_EMAIL, MEGA_PASSWORD)
            
            # Get or create the DB backup folder
            folder_id = get_or_create_folder(m, MEGA_DB_FOLDER)
            
            if folder_id:
                logger.info(f"Uploading {os.path.basename(zip_path)} to MEGA folder {MEGA_DB_FOLDER}...")
                
                # Upload to the specific folder
                file = m.upload(zip_path, folder_id)
                logger.info(f"Successfully uploaded to MEGA")
                
                # Clean up old MEGA backups
                clean_old_mega_backups(m, folder_id)
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
    
    return False

def clean_old_mega_backups(m, folder_id):
    """
    Remove old backup files from the specified MEGA folder.

    - Lists all backup zip files in the MEGA folder.
    - Sorts them by timestamp.
    - Deletes the oldest files beyond the configured keep count.
    - Empties the MEGA trash to free up space.
    """
    try:
        files = m.get_files()
        # Find all backup files in the folder
        backup_files = [
            (file_data.get('ts', 0), file_id, file_data.get('a', {}).get('n', ''))
            for file_id, file_data in files.items()
            if isinstance(file_data, dict)
            and file_data.get('t') == 0
            and file_data.get('p') == folder_id
            and file_data.get('a', {}).get('n', '').startswith('db_backup_')
            and file_data.get('a', {}).get('n', '').endswith('.zip')
        ]
        
        logger.info(f"Found {len(backup_files)} backup files on MEGA")
        
        # Sort by timestamp (newest first)
        backup_files.sort(reverse=True)
        
        # Remove backups beyond the keep count
        if len(backup_files) > DB_BACKUP_KEEP_COUNT:
            for i in range(DB_BACKUP_KEEP_COUNT, len(backup_files)):
                logger.info(f"Deleting old backup from MEGA: {backup_files[i][2]}")
                m.delete(backup_files[i][1])
            
            # Empty trash to free space
            m.empty_trash()
            logger.info("Emptied MEGA trash")
        
        logger.info(f"MEGA cleanup complete. Kept {min(len(backup_files), DB_BACKUP_KEEP_COUNT)} backups")
        
    except Exception as e:
        logger.error(f"Error cleaning old MEGA backups: {e}")

if __name__ == '__main__':
    """
    Main entry point for the backup service.

    - Verifies required environment variables.
    - Ensures the backup directory exists.
    - Waits for the database to be ready.
    - Schedules periodic backup jobs (local or MEGA).
    - Starts the scheduler and handles graceful shutdown.
    """
    # Verify essential environment variables
    if not all([POSTGRES_PASSWORD, POSTGRES_DB]):
        logger.error("Missing required environment variables: POSTGRES_PASSWORD and POSTGRES_DB must be set")
        exit(1)
    
    # Ensure backup directory exists
    os.makedirs(DB_BACKUP_DIR, exist_ok=True)
    
    # Wait for database to be ready
    wait_for_database()
    
    # Initialize and configure scheduler
    scheduler = BlockingScheduler()
    
    # Add database backup job
    if MEGA_EMAIL and MEGA_PASSWORD:
        scheduler.add_job(
            upload_to_mega,
            'interval',
            seconds=DB_BACKUP_INTERVAL,
            id='postgres_backup',
            next_run_time=datetime.now(),
            coalesce=True,
            max_instances=1
        )
        logger.info(f'Database backup service started with MEGA upload. Will run every {DB_BACKUP_INTERVAL} seconds.')
    else:
        scheduler.add_job(
            perform_backup,
            'interval',
            seconds=DB_BACKUP_INTERVAL,
            id='postgres_backup',
            next_run_time=datetime.now(),
            coalesce=True,
            max_instances=1
        )
        logger.info(f'Database backup service started (local only). Will run every {DB_BACKUP_INTERVAL} seconds.')
    
    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        logger.info('Database backup service stopped.')
