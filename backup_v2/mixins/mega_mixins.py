from mega import Mega
from .logger_mixins import LoggerMixin

class MEGAMixin:
    def __init__(self) -> None:
        self.client = Mega()

    def connect_to_mega(self, email: str, password: str, logger: LoggerMixin | None) -> bool:
        
        if not logger:
            raise ValueError("LoggerMixin instance is required for logging.")
        
        logger.log_info("Connecting to MEGA...")
        try:
            # Attempt to login
            return self.client.login(email, password)

        except Exception as e:
            logger.log_error(f"Error logging in to MEGA: {e}")
            return False
    
    def get_or_create_folder(self, folder_name: str, logger: LoggerMixin | None) -> str | None:
        if not logger:
            raise ValueError("LoggerMixin instance is required for logging.")
        
        logger.log_info(f"Getting or creating folder '{folder_name}' in MEGA...")
        try:
            # Check if folder exists
            folder = self.client.find(folder_name)
            if folder:
                logger.log_info(f"Folder '{folder_name}' found.")
                return folder[0]
            else:
                # Create folder
                self.client.get_files()  # refresh nodes

                self.client.create_folder(folder_name)
                logger.log_info(f"Folder '{folder_name}' created.")

                self.client.get_files()  # refresh AGAIN

                folder_node = self.client.find(folder_name)
                if not folder_node:
                    raise Exception(f"Folder '{folder_name}' not found after creation")

                return folder_node[0]

        except Exception as e:
            logger.log_error(f"Error accessing or creating folder '{folder_name}': {e}")
            return None
    
    def execute_upload(self, local_path: str, remote_folder: str, logger: LoggerMixin | None) -> bool:
        if not logger:
            raise ValueError("LoggerMixin instance is required for logging.")
        
        try:
            logger.log_info(f"Preparing to upload file '{local_path}' to MEGA...")
            
            folder = self.get_or_create_folder(remote_folder, logger=logger)
            if not folder:
                logger.log_error(f"Failed to access or create remote folder '{remote_folder}'.")
                return False
            
            logger.log_info(f"Uploading file '{local_path}' to MEGA folder '{remote_folder}'...")
            
            self.client.upload(local_path, folder)
            logger.log_info(f"File '{local_path}' uploaded to MEGA folder '{remote_folder}'.")
            
            return True
            
        except Exception as e:
            logger.log_error(f"Error uploading file to MEGA: {e}")
            return False
        
    def read_file(self, remote_path: str, logger: LoggerMixin | None) -> str | None:
        """Reads a file from MEGA and returns its content as a string."""
        
        if not logger:
            raise ValueError("LoggerMixin instance is required for logging.")
        
        try:
            self.client.get_files()  # refresh nodes
            
            file_node = self.client.find(remote_path)
            if not file_node:
                raise FileNotFoundError(f"File '{remote_path}' not found in MEGA.")

            content = self.client.get_file(file_node[0])
            return content.decode('utf-8')

        except Exception as e:
            logger.log_error(f"Error reading file '{remote_path}' from MEGA: {e}")
            return None