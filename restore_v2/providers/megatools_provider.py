import os
import subprocess
import logging

logger = logging.getLogger("MegatoolsProvider")

class MegatoolsProvider:
    def __init__(self, email, password):
        self.email = email
        self.password = password
        self.config_path = "/tmp/.megarc"

    def _create_megarc(self):
        """Creates the config file required by megatools."""
        # Using a direct path in /tmp avoids Docker $HOME resolution issues
        rc_content = f"[Login]\nUsername = {self.email}\nPassword = {self.password}\n"
        
        with open(self.config_path, 'w') as rc_file:
            rc_file.write(rc_content)
        
        os.chmod(self.config_path, 0o600)

    def connect(self):
        logger.info("Configuring megatools credentials...")
        self._create_megarc()
        
        try:
            # Explicitly pass the --config path
            # Capturing stderr so we can see the exact error if MEGA rejects us
            subprocess.run(
                ['megatools', 'ls', '--config', self.config_path, '/Root'], 
                check=True, 
                stdout=subprocess.PIPE, 
                stderr=subprocess.PIPE,
                text=True
            )
            logger.info("Connected to MEGA via megatools.")
        except subprocess.CalledProcessError as e:
            raise ConnectionError(f"Failed to authenticate with megatools. MEGA says: {e.stderr.strip()}")

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
                ['megatools', 'ls', '--config', self.config_path, remote_path], 
                capture_output=True, text=True, check=True
            )
        except subprocess.CalledProcessError as e:
            raise FileNotFoundError(f"Failed to access remote folder '{remote_path}'. Error: {e.stderr.strip()}")

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
            # Alphabetical reverse sort puts the newest date at index 0
            candidates.sort(reverse=True)
            target_remote_file = candidates[0]

        logger.info(f"Selected target for download: {os.path.basename(target_remote_file)}")

        # 3. Download
        os.makedirs(staging_dir, exist_ok=True)
        
        try:
            logger.info(f"Downloading {os.path.basename(target_remote_file)}...")
            
            subprocess.run(
                ['megatools', 'dl', '--config', self.config_path, '--path', staging_dir, target_remote_file], 
                check=True,
                capture_output=True,
                text=True
            )
            
            output_path = os.path.join(staging_dir, os.path.basename(target_remote_file))
            logger.info(f"Downloaded successfully to {output_path}")
            
            return output_path
            
        except subprocess.CalledProcessError as e:
            logger.error(f"Download failed: {e.stderr.strip()}")
            raise