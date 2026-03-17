import os
import logging
from abc import ABC, abstractmethod
from providers.rclone_provider import RcloneProvider
# Assuming you have a Config file like in your restore system
from config import Config 

logger = logging.getLogger("BackupSystem")

class BaseBackupSystem(ABC):
    def __init__(self):
        self.config = Config
        # Initialize our freshly scrubbed rclone provider
        self.provider = RcloneProvider(Config.MEGA_EMAIL, Config.MEGA_PASSWORD)

    @abstractmethod
    def create_archive(self) -> str:
        """
        Child classes (like ImageBackupSystem) must implement this.
        It should compress the target files and return the absolute path 
        to the resulting .zip file.
        """
        pass

    def cleanup(self, file_path):
        """Deletes the local temporary zip file after upload."""
        if file_path and os.path.exists(file_path):
            logger.info(f"Cleaning up temporary archive: {file_path}")
            os.remove(file_path)

    def run_lifecycle(self):
        """The master pipeline for backing up data."""
        archive_path = None
        try:
            logger.info("--- Starting Backup Lifecycle ---")
            
            # 1. Compress the data (Handled by the child class)
            archive_path = self.create_archive()
            
            # 2. Authenticate with MEGA
            self.provider.connect()
            
            # 3. Upload to MEGA
            # Note: You'll define self.remote_folder in the child class
            self.provider.upload_backup(archive_path, self.remote_folder)
            
            logger.info("--- Backup Lifecycle Completed Successfully ---")

        except Exception as e:
            logger.error(f"❌ Critical Failure during backup: {str(e)}")
            raise
        finally:
            # 4. Always clean up, even if it fails
            self.cleanup(archive_path)