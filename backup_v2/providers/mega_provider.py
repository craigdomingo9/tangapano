import os
from interfaces import ICloudProvider
from mixins import LoggerMixin, RetryMixin, ManifestMixin, MEGAMixin


class MEGAProvider(MEGAMixin, ManifestMixin, ICloudProvider, LoggerMixin, RetryMixin):
    def __init__(self) -> None:
        super().__init__()
        self.logger = LoggerMixin()
        self.max_retries = 3
        self.retry_delay = 5  # seconds
        self.email = os.getenv("MEGA_EMAIL", "user")
        self.password = os.getenv("MEGA_PASSWORD", "password")
        self.is_connected = False
        
    def connect(self) -> bool:
        self.is_connected =  self.retry_operation(
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
            self.logger.log_error("Failed to connect to MEGA.")
            return False
        
        self.logger.log_info("Connected to MEGA successfully.")
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
        return True
    
