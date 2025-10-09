from .get_or_create_folder import get_or_create_folder


def get_files_from_folder(mega_instance, folder_name, logger):
    """
    Get all files in a folder from MEGA.
    
    Args:
        mega_instance (MegaApi): MEGA API instance.
        folder_name (str): Name of the folder to get files from.
        logger: Logger object for logging messages.
        
    Returns:
        dict: A dictionary of file IDs and file data for all files in the folder.
    """
    try:
        folder_id = get_or_create_folder(mega_instance, folder_name, logger)
        if not folder_id:
            logger.error(f"Could not get/create folder: {folder_name}")
            return None
        
        files = mega_instance.get_files()
        
        return {file_id: file_data for file_id, file_data in files.items() if file_data.get('p') == folder_id}
    except Exception as e:
        logger.error(f"Error getting files from folder: {e}")
        import traceback
        traceback.print_exc()
        return None

