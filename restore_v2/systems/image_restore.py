from systems.base_restore import BaseRestoreSystem
from utils import file_ops
import logging

class ImageRestoreSystem(BaseRestoreSystem):
    def perform_restore(self, zip_path: str):
        dest = self.config.RESTORE_DESTINATION
        
        # Safety Check
        if self.config.NUCLEAR_WIPE:
            logging.info("Nuclear Wipe enabled. Clearing destination...")
            file_ops.nuclear_wipe_dir(dest)
            
        logging.info(f"Restoring images to {dest}...")
        file_ops.unzip_to_dir(zip_path, dest)
