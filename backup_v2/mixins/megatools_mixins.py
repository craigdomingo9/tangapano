import os
import subprocess
import uuid
from .logger_mixins import LoggerMixin

class MegatoolsMixin:
    """
    Mixin class providing raw megatools CLI functionality.
    """
    
    def _create_megarc(self, email: str, password: str) -> str:
        """
        Creates the ~/.megarc file required by megatools for authentication.
        """
        rc_content = f"[Login]\nUsername = {email}\nPassword = {password}\n"
        rc_path = os.path.expanduser("~/.megarc")
        
        with open(rc_path, 'w') as rc_file:
            rc_file.write(rc_content)
        
        os.chmod(rc_path, 0o600)
        return rc_path

    def connect_to_mega(self, email: str, password: str, logger: LoggerMixin | None) -> bool:
        if not logger:
            raise ValueError("LoggerMixin instance is required.")
        
        logger.log_info("Configuring megatools credentials...")
        self._create_megarc(email, password)
        
        try:
            # Test the connection by listing the root directory
            subprocess.run(
                ['megatools', 'ls', '/Root'],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
            return True
        except subprocess.CalledProcessError:
            logger.log_error("Failed to authenticate with megatools. Check credentials.")
            return False

    def get_or_create_folder(self, folder_name: str, logger: LoggerMixin | None) -> bool:
        if not logger:
            raise ValueError("LoggerMixin instance is required.")
            
        remote_path = f"/Root/{folder_name.strip('/')}"
        logger.log_info(f"Ensuring folder '{remote_path}' exists...")
        
        try:
            # Check if it exists
            subprocess.run(
                ['megatools', 'ls', remote_path],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
            return True # Folder exists
        except subprocess.CalledProcessError:
            # Folder doesn't exist, create it
            try:
                subprocess.run(['megatools', 'mkdir', remote_path], check=True)
                logger.log_info(f"Folder '{remote_path}' created successfully.")
                return True
            except subprocess.CalledProcessError as e:
                logger.log_error(f"Failed to create folder '{remote_path}': {e}")
                return False

    def execute_upload(self, local_path: str, remote_folder: str, logger: LoggerMixin | None) -> bool:
        if not logger:
            raise ValueError("LoggerMixin instance is required.")
            
        remote_path = f"/Root/{remote_folder.strip('/')}"
        
        try:
            self.get_or_create_folder(remote_folder, logger)
            logger.log_info(f"Uploading '{local_path}' to '{remote_path}' via megatools...")
            
            subprocess.run(
                ['megatools', 'put', '--path', remote_path, local_path],
                check=True
            )
            return True
        except subprocess.CalledProcessError as e:
            logger.log_error(f"Megatools upload failed for '{local_path}': {e}")
            return False

    def delete_remote_file(self, remote_folder: str, filename: str, logger: LoggerMixin | None) -> bool:
        """Removes a file from MEGA."""
        if not logger:
            raise ValueError("LoggerMixin instance is required.")
            
        remote_file_path = f"/Root/{remote_folder.strip('/')}/{filename}"
        
        try:
            subprocess.run(
                ['megatools', 'rm', remote_file_path],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
            return True
        except subprocess.CalledProcessError:
            # Often fails if the file doesn't exist, which is usually fine for cleanup
            return False

    def read_file(self, remote_file: str, logger: LoggerMixin | None) -> str | None:
        """Downloads a file to a temp location, reads it, and deletes it."""
        if not logger:
            raise ValueError("LoggerMixin instance is required.")
            
        remote_path = f"/Root/{remote_file.strip('/')}"
        temp_dl_dir = "/tmp/mega_dl"
        os.makedirs(temp_dl_dir, exist_ok=True)
        
        filename = os.path.basename(remote_path)
        local_temp_path = os.path.join(temp_dl_dir, f"{uuid.uuid4()}_{filename}")
        
        try:
            # Megatools dl downloads into a directory, so we change cwd or move it
            subprocess.run(
                ['megatools', 'dl', '--path', local_temp_path, remote_path],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
            
            with open(local_temp_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            return content
        except subprocess.CalledProcessError as e:
            logger.log_error(f"Failed to read remote file '{remote_path}': {e}")
            return None
        except Exception as e:
            logger.log_error(f"Error processing downloaded file: {e}")
            return None
        finally:
            if os.path.exists(local_temp_path):
                os.remove(local_temp_path)
