import os
import shutil
import zipfile
import logging

logger = logging.getLogger("FileOps")

def verify_zip(file_path):
    """Checks if the file is a valid zip archive."""
    if not zipfile.is_zipfile(file_path):
        raise ValueError(f"File {file_path} is corrupt or not a zip.")
    logger.info("Integrity check passed.")

def nuclear_wipe_dir(directory):
    """Deletes all contents of a directory."""
    logger.warning(f"☢️ WIPING DIRECTORY: {directory}")
    for item in os.listdir(directory):
        path = os.path.join(directory, item)
        try:
            if os.path.isfile(path) or os.path.islink(path):
                os.unlink(path)
            elif os.path.isdir(path):
                shutil.rmtree(path)
        except Exception as e:
            logger.error(f"Failed to delete {path}: {e}")

def unzip_to_dir(zip_path, target_dir):
    """Extracts zip contents to a directory."""
    logger.info(f"Unzipping {zip_path} -> {target_dir}")
    with zipfile.ZipFile(zip_path, 'r') as zf:
        zf.extractall(target_dir)

def unzip_first_file(zip_path, output_dir):
    """
    Extracts the first file found in the zip. 
    Useful for SQL dumps where we expect 1 .sql file inside the zip.
    Returns the path to the extracted file.
    """
    with zipfile.ZipFile(zip_path, 'r') as zf:
        file_list = zf.namelist()
        if not file_list:
            raise ValueError("Zip archive is empty")
        
        target_file = file_list[0]
        zf.extract(target_file, output_dir)
        return os.path.join(output_dir, target_file)
