#!/usr/bin/env python3
"""
Image Restore Script
Run within Docker container to restore images from local or MEGA backups
"""

import os
import sys
import zipfile
import logging
import argparse
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
IMAGES_SOURCE_DIR = os.getenv('IMAGES_SOURCE_DIR', '/app/media')
IMAGES_BACKUP_DIR = os.getenv('IMAGES_BACKUP_DIR', '/backups/images')
MEGA_EMAIL = os.getenv('MEGA_EMAIL')
MEGA_PASSWORD = os.getenv('MEGA_PASSWORD')
MEGA_IMAGES_FOLDER = os.getenv('MEGA_IMAGES_FOLDER', 'media-weekly-backups')

def validate_environment():
    """Validate required environment variables are set"""
    if not os.path.exists(IMAGES_SOURCE_DIR):
        logger.error(f"Target directory does not exist: {IMAGES_SOURCE_DIR}")
        return False
    return True

def list_available_backups(backup_source='local'):
    """
    List all available backups from the specified source
    
    Args:
        backup_source (str): 'local' or 'mega'
    
    Returns:
        list: Sorted list of backup filenames with week information
    """
    backups = []
    
    if backup_source == 'local':
        weekly_dir = os.path.join(IMAGES_BACKUP_DIR, 'weekly')
        if not os.path.exists(weekly_dir):
            logger.error(f"Weekly backup directory does not exist: {weekly_dir}")
            return []
            
        for filename in os.listdir(weekly_dir):
            if filename.startswith('images_') and filename.endswith('.zip'):
                # Extract year and week from filename
                try:
                    parts = filename.replace('images_', '').replace('.zip', '').split('-')
                    year = int(parts[0])
                    week = int(parts[1].replace('W', ''))
                    backups.append((year, week, filename))
                except (ValueError, IndexError):
                    continue
                    
    elif backup_source == 'mega':
        try:
            from mega import Mega
            mega = Mega()
            m = mega.login(MEGA_EMAIL, MEGA_PASSWORD)
            
            files = m.get_files()
            folder_id = None
            for file_id, file_data in files.items():
                if file_data.get('a', {}).get('n') == MEGA_IMAGES_FOLDER and file_data.get('t') == 1:
                    folder_id = file_id
                    break
            
            if folder_id:
                for file_id, file_data in files.items():
                    if (file_data.get('p') == folder_id and 
                        file_data.get('a', {}).get('n').startswith('images_') and 
                        file_data.get('a', {}).get('n').endswith('.zip')):
                        
                        filename = file_data['a']['n']
                        # Extract year and week from filename
                        try:
                            parts = filename.replace('images_', '').replace('.zip', '').split('-')
                            year = int(parts[0])
                            week = int(parts[1].replace('W', ''))
                            backups.append((year, week, filename))
                        except (ValueError, IndexError):
                            continue
        except Exception as e:
            logger.error(f"Error listing MEGA backups: {e}")
    
    # Sort by year and week (newest first)
    backups.sort(key=lambda x: (x[0], x[1]), reverse=True)
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
            if file_data.get('a', {}).get('n') == MEGA_IMAGES_FOLDER and file_data.get('t') == 1:
                folder_id = file_id
                break
        
        if not folder_id:
            logger.error(f"MEGA folder '{MEGA_IMAGES_FOLDER}' not found")
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

def restore_images(backup_paths, target_directory):
    """
    Restore images from backup files
    
    Args:
        backup_paths (list): List of paths to backup zip files
        target_directory (str): Directory to restore images to
        
    Returns:
        bool: True if restore succeeded, False otherwise
    """
    restored_count = 0
    
    for backup_path in backup_paths:
        if not os.path.exists(backup_path):
            logger.error(f"Backup file not found: {backup_path}")
            continue
            
        try:
            logger.info(f"Restoring from {os.path.basename(backup_path)}...")
            with zipfile.ZipFile(backup_path, 'r') as zipf:
                # Extract all files, preserving directory structure
                zipf.extractall(target_directory)
                file_count = len(zipf.namelist())
                restored_count += file_count
                logger.info(f"Restored {file_count} files from {os.path.basename(backup_path)}")
                
        except Exception as e:
            logger.error(f"Error restoring from {backup_path}: {e}")
            continue
    
    logger.info(f"Image restore complete. Total files restored: {restored_count}")
    return restored_count > 0

def main():
    """Main function to handle command line arguments and coordinate restore"""
    parser = argparse.ArgumentParser(description='Restore images from backup')
    parser.add_argument('--source', choices=['mega', 'local'], default='mega',
                      help='Backup source (default: mega)')
    parser.add_argument('--backups', nargs='+', help='Specific backup files to restore')
    parser.add_argument('--weeks', nargs='+', help='Restore backups from specific weeks (format: YYYY-WW)')
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
            for year, week, filename in backups:
                print(f"  {year}-W{week:02d} - {filename}")
        else:
            print("No backups found")
        sys.exit(0)

    # Determine which backups to restore
    backup_paths = []
    
    if args.backups:
        # Use specified backups
        for backup_name in args.backups:
            if args.source == 'mega':
                # Download from MEGA
                weekly_dir = os.path.join(IMAGES_BACKUP_DIR, 'weekly')
                os.makedirs(weekly_dir, exist_ok=True)
                backup_path = download_backup_from_mega(backup_name, weekly_dir)
                if backup_path:
                    backup_paths.append(backup_path)
            else:
                # Use local backup
                backup_path = os.path.join(IMAGES_BACKUP_DIR, 'weekly', backup_name)
                if os.path.exists(backup_path):
                    backup_paths.append(backup_path)
                else:
                    logger.error(f"Backup file not found: {backup_path}")
    
    elif args.weeks:
        # Use backups from specified weeks
        all_backups = list_available_backups(args.source)
        weekly_dir = os.path.join(IMAGES_BACKUP_DIR, 'weekly')
        
        for week_str in args.weeks:
            # Parse week string (format: YYYY-WW)
            try:
                parts = week_str.split('-')
                if len(parts) != 2 or not parts[1].startswith('W'):
                    raise ValueError
                
                year = int(parts[0])
                week = int(parts[1].replace('W', ''))
                
                # Find backup for this week
                found = False
                for backup_year, backup_week, backup_name in all_backups:
                    if backup_year == year and backup_week == week:
                        if args.source == 'mega':
                            # Download from MEGA
                            os.makedirs(weekly_dir, exist_ok=True)
                            backup_path = download_backup_from_mega(backup_name, weekly_dir)
                            if backup_path:
                                backup_paths.append(backup_path)
                                found = True
                                break
                        else:
                            # Use local backup
                            backup_path = os.path.join(weekly_dir, backup_name)
                            if os.path.exists(backup_path):
                                backup_paths.append(backup_path)
                                found = True
                                break
                
                if not found:
                    logger.warning(f"No backup found for week {week_str}")
                    
            except ValueError:
                logger.error(f"Invalid week format: {week_str}. Use YYYY-WW format.")
    
    else:
        # Use all available backups
        all_backups = list_available_backups(args.source)
        weekly_dir = os.path.join(IMAGES_BACKUP_DIR, 'weekly')
        
        for year, week, backup_name in all_backups:
            if args.source == 'mega':
                # Download from MEGA
                os.makedirs(weekly_dir, exist_ok=True)
                backup_path = download_backup_from_mega(backup_name, weekly_dir)
                if backup_path:
                    backup_paths.append(backup_path)
            else:
                # Use local backup
                backup_path = os.path.join(weekly_dir, backup_name)
                if os.path.exists(backup_path):
                    backup_paths.append(backup_path)

    if not backup_paths:
        logger.error("No backup files found to restore")
        sys.exit(1)

    # Perform restore
    success = restore_images(backup_paths, IMAGES_SOURCE_DIR)
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
