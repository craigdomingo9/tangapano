from datetime import datetime
import os
import subprocess
import zipfile
from .create_pgpass_file import create_pgpass_file
from .clean_old_local_backups import clean_old_local_backups
from .utils import logger
from .env_file import (
    DB_BACKUP_DIR,
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_USER
)

logger = logger()

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
    env['PGPASSFILE'] = create_pgpass_file()
    
    try:
        # Execute pg_dump
        logger.info(f"Starting database backup: {backup_name}")
        with open(backup_path, 'w') as f:
            subprocess.run([
                'pg_dump', 
                '-h', POSTGRES_HOST, 
                '-U', POSTGRES_USER, 
                '-d', POSTGRES_DB
            ], stdout=f, env=env)
        
        # Compress the backup into a zip file
        zip_path = backup_path.replace('.sql', '.zip')
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            zipf.write(backup_path, os.path.basename(backup_path))
        
        # Remove the uncompressed SQL file
        os.remove(backup_path)
        
        # Clean up old local backups
        clean_old_local_backups()
        
        logger.info(f"Database backup completed: {zip_path}")
        return zip_path
        
    
    except subprocess.CalledProcessError as e:
        logger.error(f'Backup failed with error: {e}')
        return None


