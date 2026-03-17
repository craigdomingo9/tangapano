import os
import subprocess
import logging

logger = logging.getLogger("RcloneProvider")

class RcloneProvider:
    def __init__(self, email, password):
        self.email = email
        self.password = password
        # We will store our dynamic rclone config in this environment dictionary
        self._rclone_env = os.environ.copy()

    def connect(self):
        logger.info("Configuring rclone credentials...")
        try:
            # 1. Obscure the password
            result = subprocess.run(
                ['rclone', 'obscure', self.password],
                capture_output=True, text=True, check=True
            )
            obscured_password = result.stdout.strip()
            
            # 2. Inject credentials into the environment variables
            # This creates a temporary, memory-only rclone remote named "mega_remote"
            self._rclone_env['RCLONE_CONFIG_MEGA_REMOTE_TYPE'] = 'mega'
            self._rclone_env['RCLONE_CONFIG_MEGA_REMOTE_USER'] = self.email
            self._rclone_env['RCLONE_CONFIG_MEGA_REMOTE_PASS'] = obscured_password
            
            # 3. Test connection by listing the root using our temporary remote
            subprocess.run(
                ['rclone', 'lsf', 'mega_remote:/'], 
                env=self._rclone_env,
                check=True, capture_output=True, text=True
            )
            logger.info("Connected to MEGA via rclone.")
        except subprocess.CalledProcessError as e:
            error_msg = e.stderr.strip() if e.stderr else "Unknown error"
            raise ConnectionError(f"Failed to authenticate with rclone. MEGA says: {error_msg}")

    def download_backup(self, remote_folder, mode, specific_filename, staging_dir) -> str:
        """
        Finds and downloads the target file.
        Returns: Path to the downloaded local file.
        """
        # Strip leading slashes to prevent double slashes in paths
        folder_path = remote_folder.strip('/')
        target_remote_dir = f"mega_remote:/{folder_path}"
        
        logger.info(f"Scanning remote folder: '{folder_path}'...")
        
        # 1. Get file list
        try:
            result = subprocess.run(
                ['rclone', 'lsf', target_remote_dir], 
                env=self._rclone_env,
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
                ['rclone', 'copyto', source_file, output_path], 
                env=self._rclone_env,
                check=True, capture_output=True, text=True
            )
            
            logger.info(f"Downloaded successfully to {output_path}")
            return output_path
            
        except subprocess.CalledProcessError as e:
            logger.error(f"Download failed: {e.stderr.strip()}")
            raise