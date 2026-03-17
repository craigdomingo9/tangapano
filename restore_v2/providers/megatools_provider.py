import os
import subprocess
import logging

logger = logging.getLogger("MegatoolsProvider")

class MegatoolsProvider:
    def __init__(self, email, password):
        self.email = email
        self.password = password

    def _create_megarc(self):
        """Creates the ~/.megarc file required by megatools for authentication."""
        rc_content = f"[Login]\nUsername = {self.email}\nPassword = {self.password}\n"
        rc_path = os.path.expanduser("~/.megarc")
        
        with open(rc_path, 'w') as rc_file:
            rc_file.write(rc_content)
        
        os.chmod(rc_path, 0o600)

    def connect(self):
        logger.info("Configuring megatools credentials...")
        self._create_megarc()
        
        try:
            # Test connection by listing the root directory
            subprocess.run(
                ['megatools', 'ls', '/Root'], 
                check=True, 
                stdout=subprocess.DEVNULL, 
                stderr=subprocess.DEVNULL
            )
            logger.info("Connected to MEGA via megatools.")
        except subprocess.CalledProcessError:
            raise ConnectionError("Failed to authenticate with megatools. Check credentials.")

    def download_backup(self, remote_folder, mode, specific_filename, staging_dir) -> str:
        """
        Finds and downloads the target file.
        Returns: Path to the downloaded local file.
        """
        remote_path = f"/Root/{remote_folder.strip('/')}"
        logger.info(f"Scanning remote folder: '{remote_path}'...")
        
        # 1. Get file list
        try:
            result = subprocess.run(
                ['megatools', 'ls', remote_path], 
                capture_output=True, text=True, check=True
            )
        except subprocess.CalledProcessError as e:
            raise FileNotFoundError(f"Failed to access remote folder '{remote_path}'. Error: {e}")

        # `megatools ls` returns full paths (e.g., /Root/Backups/file.zip)
        candidates = [
            line.strip() for line in result.stdout.split('\n') 
            if line.strip().endswith('.zip')
        ]

        if not candidates:
            raise FileNotFoundError(f"No .zip backup files found in folder '{remote_folder}'")

        target_remote_file = None

        # 2. Filter logic
        if mode == "SPECIFIC":
            expected_path = f"{remote_path}/{specific_filename}"
            if expected_path not in candidates:
                raise FileNotFoundError(f"File '{specific_filename}' not found in '{remote_folder}'.")
            target_remote_file = expected_path
        else:
            # LATEST mode: 
            # Because backup files have chronological timestamps in their names, 
            # an alphabetical reverse sort puts the newest file at index 0.
            candidates.sort(reverse=True)
            target_remote_file = candidates[0]

        logger.info(f"Selected target for download: {os.path.basename(target_remote_file)}")

        # 3. Download
        os.makedirs(staging_dir, exist_ok=True)
        
        try:
            logger.info(f"Downloading {os.path.basename(target_remote_file)}...")
            
            subprocess.run(
                ['megatools', 'dl', '--path', staging_dir, target_remote_file], 
                check=True
            )
            
            output_path = os.path.join(staging_dir, os.path.basename(target_remote_file))
            logger.info(f"Downloaded successfully to {output_path}")
            
            return output_path
            
        except subprocess.CalledProcessError as e:
            logger.error(f"Download failed: {e}")
            raise