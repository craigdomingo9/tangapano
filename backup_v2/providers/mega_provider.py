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
    
    def safe_upload(self, local_path: str, remote_folder: str) -> bool:
        """
        Safely updates a remote file by:
        1. Uploading the new file with a .temp extension.
        2. Deleting the existing production file.
        3. Renaming the .temp file to the production name.
        """
        if not self.is_connected:
            self.logger.log_error("Not connected to MEGA.")
            return False

        target_filename = os.path.basename(local_path)
        temp_filename = f"{target_filename}.temp"
        
        # We need to temporarily rename the local file so MEGA uploads it with the .temp name
        # (MEGA's put() usually takes the filename from the local path)
        local_temp_path = f"{local_path}.temp"
        
        try:
            # 1. Prepare Local Temp File
            os.rename(local_path, local_temp_path)
            
            # 2. Upload the .temp version
            self.logger.log_info(f"Uploading temporary draft: {temp_filename}...")
            # Note: We use our mixin's execute_upload or raw mega.upload logic here
            uploaded_node = self.retry_operation(
                func=lambda: self.execute_upload(
                    local_path=local_temp_path, 
                    remote_folder=remote_folder, 
                    logger=self.logger
                ),
                max_retries=self.max_retries,
                retry_delay=self.retry_delay,
                logger=self.logger
            )
            
            if not uploaded_node:
                raise Exception("Upload returned no node.")

            # 3. The Swap (Critical Section)
            self.logger.log_info("Upload verified. Swapping files...")
            
            self.client.get_files()  # Refresh file list
            # A. Find and Delete the OLD file (if it exists)
            # implementation depends on your MEGAMixin's 'find_file_node'
            old_node = self.client.find(target_filename)
            if old_node:
                self.client.delete(old_node[0])
                self.logger.log_info(f"Removed old version of {target_filename}")

            # B. Rename the NEW (.temp) file to the real name
            # The uploaded_node is the handle to the file we just sent
            # Depending on mega.py version, execute_upload might return the node or we find it
            if isinstance(uploaded_node, dict): # mega.py usually returns dict
                 self.client.rename(uploaded_node, target_filename)
            else:
                 # Fallback if upload didn't return node, find the temp file
                 temp_node = self.client.find(temp_filename)
                 if temp_node:
                     self.client.rename(temp_node, target_filename)
            
            self.logger.log_info(f"Swap complete. {target_filename} is live.")
            return True

        except Exception as e:
            self.logger.log_error(f"Safe Upload Failed: {e}")
            # Attempt Cleanup of the temp remote file if it lingers
            try:
                garbage_node = self.client.find(temp_filename)
                if garbage_node: self.client.delete(garbage_node[0])
            except:
                pass
            return False
            
        finally:
            # Restore local filename so the calling system can clean it up normally
            if os.path.exists(local_temp_path):
                os.rename(local_temp_path, local_path)
    
