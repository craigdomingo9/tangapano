#!/usr/bin/env python3
"""
Database Restore Script for PostgreSQL
Run within Docker container to restore database from local or MEGA backups
"""

import os
import sys
import zipfile
import tempfile
import logging
import argparse
import subprocess
from datetime import datetime
from dotenv import load_dotenv
from mega_downloader import download_mega_file

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# Configuration from environment variables
POSTGRES_HOST = os.getenv('POSTGRES_HOST', 'db')
POSTGRES_USER = os.getenv('POSTGRES_USER', 'postgres')
POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD')
POSTGRES_DB = os.getenv('POSTGRES_DB')
DB_BACKUP_DIR = os.getenv('DB_BACKUP_DIR', '/app/backups/db')
MEGA_EMAIL = os.getenv('MEGA_EMAIL')
MEGA_PASSWORD = os.getenv('MEGA_PASSWORD')
MEGA_DB_FOLDER = os.getenv('MEGA_DB_FOLDER', 'db-daily-backups')

def validate_environment():
    """Validate required environment variables are set"""
    if not all([POSTGRES_PASSWORD, POSTGRES_DB]):
        logger.error("Missing required environment variables: POSTGRES_PASSWORD and POSTGRES_DB")
        return False
    return True

def list_available_backups(backup_source='local'):
    """
    List all available backups from the specified source
    
    Args:
        backup_source (str): 'local' or 'mega'
        
    Returns:
        list: Sorted list of backup filenames with timestamps
    """
    backups = []
    
    if backup_source == 'local':
        if not os.path.exists(DB_BACKUP_DIR):
            logger.error(f"Backup directory {DB_BACKUP_DIR} does not exist")
            return []
            
        for filename in os.listdir(DB_BACKUP_DIR):
            if filename.startswith('db_backup_') and filename.endswith('.zip'):
                try:
                    # Extract timestamp from filename
                    timestamp_str = filename.replace('db_backup_', '').replace('.zip', '')
                    timestamp = datetime.strptime(timestamp_str, "%Y-%m-%d_%H-%M-%S")
                    backups.append((timestamp, filename))
                except ValueError:
                    continue
                    
    elif backup_source == 'mega':
        try:
            from mega import Mega
            mega = Mega()
            m = mega.login(MEGA_EMAIL, MEGA_PASSWORD)
            
            files = m.get_files()
            folder_id = None
            for file_id, file_data in files.items():
                if file_data.get('a', {}).get('n') == MEGA_DB_FOLDER and file_data.get('t') == 1:
                    folder_id = file_id
                    break
            
            if folder_id:
                for file_id, file_data in files.items():
                    if (file_data.get('p') == folder_id and 
                        file_data.get('a', {}).get('n').startswith('db_backup_') and 
                        file_data.get('a', {}).get('n').endswith('.zip')):
                        
                        filename = file_data['a']['n']
                        timestamp_str = filename.replace('db_backup_', '').replace('.zip', '')
                        try:
                            timestamp = datetime.strptime(timestamp_str, "%Y-%m-%d_%H-%M-%S")
                            backups.append((timestamp, filename))
                        except ValueError:
                            continue
        except Exception as e:
            logger.error(f"Error listing MEGA backups: {e}")
    
    # Sort by timestamp (newest first)
    backups.sort(key=lambda x: x[0], reverse=True)
    return backups

def download_backup_from_mega(backup_filename, target_directory):
    """
    Download a specific backup from MEGA
    
    Args:
        backup_filename (str): Name of the backup file to download
        target_directory (str): Directory to save the downloaded file
        
    Returns:
        str: Path to the downloaded file, or None if failed
    """
    try:
        from mega import Mega
        mega = Mega()
        m = mega.login(MEGA_EMAIL, MEGA_PASSWORD)
        
        files = m.get_files()
        folder_id = None
        for file_id, file_data in files.items():
            if file_data.get('a', {}).get('n') == MEGA_DB_FOLDER and file_data.get('t') == 1:
                folder_id = file_id
                break
        
        if not folder_id:
            logger.error(f"MEGA folder '{MEGA_DB_FOLDER}' not found")
            return None
        
        for file_id, file_data in files.items():
            if (file_data.get('p') == folder_id and 
                file_data.get('a', {}).get('n') == backup_filename):
                
                # Get public link to download
                file = m.find(backup_filename)
                
                if not file:
                    logger.error(f"Backup file not found on MEGA: {backup_filename}")
                    return None
                
                logger.info("Getting public link for backup file...")
                public_link = m.get_link(file)
                
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

def restore_database(backup_path):
    """
    Restore database from backup file
    
    Args:
        backup_path (str): Path to the backup zip file
        
    Returns:
        bool: True if restore succeeded, False otherwise
    """
    # Create temporary directory for extraction
    with tempfile.TemporaryDirectory() as temp_dir:
        try:
            # Extract SQL file from zip
            with zipfile.ZipFile(backup_path, 'r') as zipf:
                sql_files = [
                    f
                    for f in zipf.namelist()
                    if f.endswith('.sql')
                ]
                if not sql_files:
                    logger.error("No SQL file found in backup archive")
                    return False
                
                # Extract to temporary directory
                zipf.extractall(temp_dir)
                sql_path = os.path.join(temp_dir, sql_files[0])

            # Set environment for psql
            env = os.environ.copy()
            env['PGPASSWORD'] = POSTGRES_PASSWORD
            
            # Read the SQL file to check if it contains CREATE DATABASE statement
            with open(sql_path, 'r') as f:
                sql_content = f.read(5000)  # Read first 5KB


            # If the SQL file contains CREATE DATABASE, handle it specially
            if 'CREATE DATABASE' in sql_content.upper():
                logger.info("SQL file contains CREATE DATABASE statements")
                
                # First, connect to postgres database to drop and recreate the target database
                subprocess.run([
                    'psql',
                    '-h', POSTGRES_HOST,
                    '-U', POSTGRES_USER,
                    '-d', 'postgres',
                    '-c', f"DROP DATABASE IF EXISTS {POSTGRES_DB} WITH (FORCE);"
                ], env=env, check=True)
                
                subprocess.run([
                    'psql',
                    '-h', POSTGRES_HOST,
                    '-U', POSTGRES_USER,
                    '-d', 'postgres',
                    '-c', f"CREATE DATABASE {POSTGRES_DB};"
                ], env=env, check=True)
        
            # Restore the database
            with open(sql_path, 'r') as f:
                result = subprocess.run([
                    'psql',
                    '-h', POSTGRES_HOST,
                    '-U', POSTGRES_USER,
                    '-d', POSTGRES_DB
                ], stdin=f, env=env, check=True)
            
            
            if result.returncode == 0:
                logger.info("Database restored successfully")
                return True
            else:
                logger.error(f"Restore failed with error: {result.stderr}")
                return False
        
        except Exception as e:
            logger.error(f"Error during restore: {e}")
            return False

def main():
    """Main function to handle command line arguments and coordinate restore"""
    parser = argparse.ArgumentParser(description='Restore PostgreSQL database from backup')
    parser.add_argument('--source', choices=['mega', 'local'], default='mega',
                      help='Backup source (default: mega)')
    parser.add_argument('--backup', help='Specific backup file to restore')
    parser.add_argument('--list', action='store_true', help='List available backups and exit')
    
    args = parser.parse_args()

    # Validate environment
    if not validate_environment():
        sys.exit(1)

    # List available backups if requested
    if args.list:
        backups = list_available_backups(args.source)
        if backups:
            print("Available backups (newest first):")
            for timestamp, filename in backups:
                print(f"  {timestamp.strftime('%Y-%m-%d %H:%M:%S')} - {filename}")
        else:
            print("No backups found")
        sys.exit(0)

    # Get backup file
    if args.backup:
        # Use specified backup
        if args.source == 'mega':
            # Download from MEGA
            os.makedirs(DB_BACKUP_DIR, exist_ok=True)
            backup_path = download_backup_from_mega(args.backup, DB_BACKUP_DIR)
            if not backup_path:
                sys.exit(1)
        else:
            # Use local backup
            backup_path = os.path.join(DB_BACKUP_DIR, args.backup)
            if not os.path.exists(backup_path):
                logger.error(f"Backup file not found: {backup_path}")
                sys.exit(1)
    else:
        # Use latest backup
        backups = list_available_backups(args.source)
        if not backups:
            logger.error("No backups found")
            sys.exit(1)
        
        timestamp, backup_filename = backups[0]
        logger.info(f"Using latest backup: {backup_filename} from {timestamp}")
        
        if args.source == 'mega':
            # Download from MEGA
            os.makedirs(DB_BACKUP_DIR, exist_ok=True)
            backup_path = download_backup_from_mega(backup_filename, DB_BACKUP_DIR)
            if not backup_path:
                sys.exit(1)
        else:
            # Use local backup
            backup_path = os.path.join(DB_BACKUP_DIR, backup_filename)

    # Perform restore
    success = restore_database(backup_path)
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()




