import os
import zipfile
from datetime import datetime
from .utils import get_logger
from .env_file import IMAGES_SOURCE_DIR, IMAGES_BACKUP_DIR, PACK_ALL_INTO_ONE_ZIP
from .load_manifest import load_manifest
from .save_manifest import save_manifest
from .verify_backup import verify_backup
from .get_backup_week import get_backup_week

logger = get_logger()



def perform_backup():
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
        
        processed_manifest = load_manifest()
        logger.info(f"Loaded manifest with {len(processed_manifest)} entries")
        
        new_entries = False 
        files_to_add = {} # Format: { (year, week): [list_of_filepaths] }
        total_new_files = 0
        
        logger.info("Performing backup...")
        
        # checks if new files exist in the source directory
        new_files_exist = False
        
        if PACK_ALL_INTO_ONE_ZIP:
            logger.info("Packing all files into one zip...")
        
        
        logger.info("Checking for new images...")
        # Walk through source directory and find new image files.
        for root, _, files in os.walk(IMAGES_SOURCE_DIR):
            for file in files:
                # Quick filter for image extensions
                if not file.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp')):
                    continue
                
                file_path = os.path.join(root, file)
                # Use a relative path as a unique identifier for the manifest
                rel_path = os.path.relpath(file_path, IMAGES_SOURCE_DIR)

                try:
                    if rel_path not in processed_manifest:
                        new_files_exist = True

                    # Group file by its creation week
                    file_timestamp = os.path.getmtime(file_path)
                    file_dt = datetime.fromtimestamp(file_timestamp)
                    iso_year, iso_week, _ = file_dt.isocalendar()
                    
                    if PACK_ALL_INTO_ONE_ZIP:
                        # set iso_year and iso_week to the current year and week in order to pack all files into one zip
                        iso_year, iso_week = get_backup_week()

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
                    logger.error(f"Error processing file: {e}")
                    continue
                    
        if not new_files_exist:
            logger.info("No new images found to backup.")
            return {}
        else:
            logger.info(f"Found {total_new_files} new images to backup.")
            logger.info("Creating zip files...")
        
        # Add new files to their respective zip files
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
                        # Verify file still exists and is accessible
                        if os.path.exists(file_path) and os.path.isfile(file_path):
                            zipf.write(file_path, rel_path_in_zip)
                            logger.debug(f"Added to {os.path.basename(zip_path)}: {rel_path_in_zip}")
                        else:
                            logger.warning(f"File no longer exists, skipping: {file_path}")
                            continue
                    except (OSError, IOError) as e:
                        logger.error(f"Error accessing file {file_path}: {e}")
                        continue
                        
            
            # Verify zip file integrity
            if not verify_backup(zip_path):
                logger.error(f"Corrupted zip file: {zip_path}")
                continue
            else:
                logger.info(f"Verified zip file: {zip_path}")
            
            updated_zips.append(zip_path)
            logger.info(f"Updated zip file: {zip_path}")
        
        # Update manifest file
        if new_entries:
            logger.info("Updating manifest...")
            save_manifest(processed_manifest)
            logger.info(f"Updated manifest with {total_new_files} new entries")
            logger.info(f"Backup complete. Added {total_new_files} new files across {len(files_to_add)} weeks.")
        else:
            logger.info("No new images found to backup.")
            
        
        return {zip_path: week_key for week_key, _ in files_to_add.items() 
                for zip_path in [get_weekly_zip_path(week_key[0], week_key[1])]}
        
    except Exception as e:
        logger.error(f"Error performing backup: {e}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        return {}
    
    


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
