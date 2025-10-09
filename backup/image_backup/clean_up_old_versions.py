from mega_utils import login_mega, get_files_from_folder, get_or_create_folder
from .env_file import MEGA_IMAGES_FOLDER, MEGA_EMAIL, MEGA_PASSWORD
from .utils import get_logger
from .get_backup_week import get_backup_week
from .file_utils import get_filename_from_file_data, get_version_from_filename, get_year_week_from_filename

logger = get_logger()


def clean_up_old_versions():
    """
    Clean up old image backup versions.
    This function removes past week's versions remaining with only the latest version of each week in the mega cloud.
    Renames the past week's latest version to its base filename. (eg. images_2025-W40_v3.zip -> images_2025-W40.zip)
    """
    
    # Login to MEGA
    mega_instance = login_mega(MEGA_EMAIL, MEGA_PASSWORD, logger)
    if not mega_instance:
        logger.error("Failed to login to MEGA")
        return False
        
    # Get all files in the folder
    files = get_files_from_folder(mega_instance, MEGA_IMAGES_FOLDER, logger)
    
    logger.info(f"Found {len(files)} files in {MEGA_IMAGES_FOLDER}")

    # Get the backup week
    current_year, current_week = get_backup_week()
    
    # Group files by (year, week) and type (images/manifest)
    files_by_week = {}
    
    for file_id, file_data in files.items():
        if isinstance(file_data, dict) and file_data.get('t') == 0:  # File type
            filename = get_filename_from_file_data(file_data)
            version = get_version_from_filename(filename)
            year, week = get_year_week_from_filename(filename)
            
            logger.info(f"File: {filename}, Version: {version}, Year: {year}, Week: {week}, File ID: {file_id}")
            
            # Skip if we couldn't parse year/week
            if year == 0 and week == 0:
                continue
                
            week_key = (year, week)
            
            if week_key not in files_by_week:
                files_by_week[week_key] = {'images': [], 'manifest': []}
            
            # Determine if this is an images file or manifest file
            if filename.startswith('images_'):
                files_by_week[week_key]['images'].append({
                    'filename': filename,
                    'version': version,
                    'file_id': file_id,
                    'file_data': file_data
                })
            elif filename.startswith('manifest_'):
                files_by_week[week_key]['manifest'].append({
                    'filename': filename,
                    'version': version,
                    'file_id': file_id,
                    'file_data': file_data
                })
    
    # Process each week group
    for (year, week), file_groups in files_by_week.items():
        # Skip current and future weeks (existing logic is fine)
        if (year, week) == (current_year, current_week) or (year > current_year or (year == current_year and week > current_week)):
            continue
        
        logger.info(f"Processing week {year}-W{week}")
        
        # Find latest images and latest manifest independently
        latest_images = max(file_groups['images'], key=lambda x: x['version']) if file_groups['images'] else None
        latest_manifest = max(file_groups['manifest'], key=lambda x: x['version']) if file_groups['manifest'] else None
        
        if not latest_images:
            logger.warning(f"No images found for week {year}-W{week}")
            # Delete all manifest files for this week since there are no images
            for manifest_info in file_groups['manifest']:
                try:
                    mega_instance.delete(manifest_info['file_id'])
                    logger.info(f"Deleted orphaned manifest: {manifest_info['filename']}")
                except Exception as e:
                    logger.error(f"Failed to delete {manifest_info['filename']}: {e}")
            continue
            
        if not latest_manifest:
            logger.warning(f"No manifest found for week {year}-W{week}")
            # Delete all image files for this week since there's no manifest
            for images_info in file_groups['images']:
                try:
                    mega_instance.delete(images_info['file_id'])
                    logger.info(f"Deleted images without manifest: {images_info['filename']}")
                except Exception as e:
                    logger.error(f"Failed to delete {images_info['filename']}: {e}")
            continue
        
        # Keep the latest images and latest manifest (they don't need matching version numbers)
        files_to_keep = {latest_images['file_id'], latest_manifest['file_id']}
        
        # Rename to base names if they have version suffixes
        if latest_images['version'] > 0:
            base_images_name = latest_images['filename'].replace(f"_v{latest_images['version']}", "")
            try:
                mega_instance.rename([latest_images['file_id'], latest_images['file_data']], base_images_name)
                logger.info(f"Renamed {latest_images['filename']} to {base_images_name}")
            except Exception as e:
                logger.error(f"Failed to rename {latest_images['filename']}: {e}")
        
        if latest_manifest['version'] > 0:
            base_manifest_name = latest_manifest['filename'].replace(f"_v{latest_manifest['version']}", "")
            try:
                mega_instance.rename([latest_manifest['file_id'], latest_manifest['file_data']], base_manifest_name)
                logger.info(f"Renamed {latest_manifest['filename']} to {base_manifest_name}")
            except Exception as e:
                logger.error(f"Failed to rename {latest_manifest['filename']}: {e}")
        
        # Delete all other files for this week
        for file_type, file_list in file_groups.items():
            for file_info in file_list:
                if file_info['file_id'] not in files_to_keep:
                    try:
                        mega_instance.delete(file_info['file_id'])
                        logger.info(f"Deleted {file_type}: {file_info['filename']}")
                    except Exception as e:
                        logger.error(f"Failed to delete {file_info['filename']}: {e}")
    
    logger.info("Cleanup completed successfully")
    return True
