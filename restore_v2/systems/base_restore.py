import os
from abc import ABC, abstractmethod
import logging
from config import Config
from providers.rclone_provider import RcloneProvider
from providers.megatools_provider import MegatoolsProvider
from utils import file_ops

logger = logging.getLogger("RestoreSystem")

class BaseRestoreSystem(ABC):
    def __init__(self):
        self.config = Config
        self.provider = RcloneProvider(Config.MEGA_EMAIL, Config.MEGA_PASSWORD)
        
    def run_lifecycle(self):
        """The standard restoration procedure."""
        try:
            logger.info(f"--- Starting {self.config.RESTORE_TYPE} Restore ---")
            
            # 1. Connect
            self.provider.connect()
            
            # 2. Prepare Staging
            os.makedirs(self.config.STAGING_DIR, exist_ok=True)
            file_ops.nuclear_wipe_dir(self.config.STAGING_DIR)
            
            # 3. Download
            local_zip = self.provider.download_backup(
                remote_folder=self.config.REMOTE_FOLDER,
                mode=self.config.RESTORE_MODE,
                specific_filename=self.config.TARGET_FILE,
                staging_dir=self.config.STAGING_DIR
            )
            
            # 4. Verification
            file_ops.verify_zip(local_zip)
            
            # 5. Execution (Polymorphic)
            logger.info("Executing specific restore logic...")
            self.perform_restore(local_zip)
            
            logger.info("✅ Restore Cycle Complete.")
            
        except Exception as e:
            logger.error(f"❌ Critical Failure: {e}")
            raise
        finally:
            # 6. Cleanup
            logger.info("Cleaning up staging...")
            file_ops.nuclear_wipe_dir(self.config.STAGING_DIR)

    @abstractmethod
    def perform_restore(self, zip_path: str):
        """Subclasses must implement the actual restore logic here."""
        pass
