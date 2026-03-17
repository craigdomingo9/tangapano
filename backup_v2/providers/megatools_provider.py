import os
from interfaces import ICloudProvider
from mixins import LoggerMixin, RetryMixin, ManifestMixin
from mixins.megatools_mixins import MegatoolsMixin


class MegatoolsProvider(MegatoolsMixin, ManifestMixin, ICloudProvider, LoggerMixin, RetryMixin):
    def __init__(self) -> None:
        super().__init__()
        self.logger = LoggerMixin()
        self.max_retries = 3
        self.retry_delay = 5  # seconds
        self.email = os.getenv("MEGA_EMAIL", "user")
        self.password = os.getenv("MEGA_PASSWORD", "password")
        self.is_connected = False
        
    def connect(self) -> bool:
        self.is_connected = self.retry_operation(
            func=lambda: self.connect_to_mega(
                email=self.email,
                password=self.password,
                logger=self.logger
            ),
            max_retries=self.max_retries,
            retry_delay=self.retry_delay,
            logger=self.logger
        )
        
        if not self.is_connected:
            self.logger.log_error("Failed to connect to MEGA via megatools.")
            return False
        
        self.logger.log_info("Connected to MEGA (megatools) successfully.")
        return self.is_connected

    def upload_file(self, local_path: str, remote_folder: str) -> bool:
        if not self.is_connected:
            self.logger.log_error("Not connected to MEGA. Cannot upload file.")
            return False
        
        if not os.path.exists(local_path):
            self.logger.log_error(f"File '{local_path}' does not exist. Cannot upload.")
            return False

        return self.retry_operation(
            func=lambda: self.execute_upload(
                local_path=local_path,
                remote_folder=remote_folder,
                logger=self.logger
            ),
            max_retries=self.max_retries,
            retry_delay=self.retry_delay,
            logger=self.logger
        )   
    
    def safe_upload(self, local_path: str, remote_folder: str) -> bool:
        """
        Safely updates a remote file. Because standard megatools lacks a reliable 'rename',
        we delete the existing production file first, then upload the new one.
        """
        if not self.is_connected:
            self.logger.log_error("Not connected to MEGA.")
            return False

        target_filename = os.path.basename(local_path)
        
        try:
            # 1. Remove the old remote file to prevent duplicates (MEGA allows same-name files)
            self.logger.log_info(f"Clearing old remote file '{target_filename}' (if it exists)...")
            self.delete_remote_file(remote_folder, target_filename, self.logger)
            
            # 2. Upload the new file
            self.logger.log_info(f"Uploading new production file '{target_filename}'...")
            success = self.retry_operation(
                func=lambda: self.execute_upload(
                    local_path=local_path, 
                    remote_folder=remote_folder, 
                    logger=self.logger
                ),
                max_retries=self.max_retries,
                retry_delay=self.retry_delay,
                logger=self.logger
            )
            
            if success:
                self.logger.log_info(f"Safe upload complete. {target_filename} is live.")
            return success

        except Exception as e:
            self.logger.log_error(f"Safe Upload Failed: {e}")
            return False
