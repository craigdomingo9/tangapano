import os
import subprocess
import logging

logger = logging.getLogger("RcloneProvider")

class RcloneProvider:
    def __init__(self, email, password):
        # Aggressively strip whitespace, newlines, and literal quote marks
        self.email = email.strip().strip("'").strip('"')
        self.password = password.strip().strip("'").strip('"')
        self.config_path = "/tmp/rclone.conf"

        # Let's log the exact length of the password so we know if hidden characters are sneaking in
        logger.debug(f"Email length: {len(self.email)}")
        logger.debug(f"Password length: {len(self.password)}")
        
        self.config_path = "/tmp/rclone.conf"

    def connect(self):
        logger.info("Configuring rclone credentials via config file...")
        try:
            # Replicate the successful shell command behavior
            # Use --config to point to a writable location for our non-root appuser
            subprocess.run(
                [
                    'rclone', '--config', self.config_path,
                    'config', 'create', 'mega_remote', 'mega',
                    'user', self.email,
                    'pass', self.password
                ],
                check=True, capture_output=True, text=True
            )
            
            logger.info("Authenticating with MEGA (this can take 1-2 minutes for the cryptographic handshake)...")
            
            # Test connection using the newly created config
            # Removing capture_output so rclone can print its progress directly to your terminal
            subprocess.run(
                ['rclone', '--config', self.config_path, 'about', 'mega_remote:', '-v'], 
                check=True
            )
            logger.info("Connected to MEGA via rclone.")
        except subprocess.CalledProcessError as e:
            raise ConnectionError("Failed to authenticate with rclone. Check the logs above.")

    def download_backup(self, remote_folder, mode, specific_filename, staging_dir) -> str:
        """
        Finds and downloads the target file.
        Returns: Path to the downloaded local file.
        """
        folder_path = remote_folder.strip('/')
        target_remote_dir = f"mega_remote:/{folder_path}"
        
        logger.info(f"Scanning remote folder: '{folder_path}'...")
        
        # 1. Get file list
        try:
            result = subprocess.run(
                ['rclone', '--config', self.config_path, 'lsf', target_remote_dir], 
                capture_output=True, text=True, check=True
            )
        except subprocess.CalledProcessError as e:
            raise FileNotFoundError(f"Failed to access remote folder '{folder_path}'. Error: {e.stderr.strip()}")

        candidates = [
            line.strip() for line in result.stdout.split('\n') 
            if line.strip().endswith('.zip')
        ]

        if not candidates:
            raise FileNotFoundError(f"No .zip backup files found in folder '{remote_folder}'")

        target_filename = None

        # 2. Filter logic
        if mode == "SPECIFIC":
            if specific_filename not in candidates:
                raise FileNotFoundError(f"File '{specific_filename}' not found in '{remote_folder}'.")
            target_filename = specific_filename
        else:
            # LATEST mode: Alphabetical reverse sort puts the newest date at index 0
            candidates.sort(reverse=True)
            target_filename = candidates[0]

        logger.info(f"Selected target for download: {target_filename}")

        # 3. Download
        os.makedirs(staging_dir, exist_ok=True)
        source_file = f"{target_remote_dir}/{target_filename}"
        output_path = os.path.join(staging_dir, target_filename)
        
        try:
            logger.info(f"Downloading {target_filename} via rclone...")
            
            subprocess.run(
                ['rclone', '--config', self.config_path, 'copyto', source_file, output_path], 
                check=True, capture_output=True, text=True
            )
            
            logger.info(f"Downloaded successfully to {output_path}")
            return output_path
            
        except subprocess.CalledProcessError as e:
            logger.error(f"Download failed: {e.stderr.strip()}")
            raise