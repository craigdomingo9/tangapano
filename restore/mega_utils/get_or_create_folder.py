def get_or_create_folder(mega_instance, folder_name, logger=None):
    """
    Get the MEGA folder ID for the given folder name, or create it if it doesn't exist.

    Args:
        mega_instance: Authenticated Mega instance.
        folder_name: Name of the folder to find or create.

    Returns:
        The folder ID if found or created, else None.
    """
    try:
        cloud_files = mega_instance.get_files()
        
        # Look for existing folder
        for file_id, file_data in cloud_files.items():
            if isinstance(file_data, dict) and file_data.get('t') == 1:  # check if file type is folder type
                if file_data.get('a', {}).get('n') == folder_name:
                    logger and logger.info(f"Found existing folder: {folder_name}")
                    return file_id
        
        # Create folder if it doesn't exist
        logger and logger.info(f"Creating new folder: {folder_name}")
        folder = mega_instance.create_folder(folder_name)
        return folder[folder_name]
        
    except Exception as e:
        logger and logger.error(f"Error with folder operation: {e}")
        return None
