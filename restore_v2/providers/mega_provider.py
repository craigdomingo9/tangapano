from mega import Mega
import logging
import os

logger = logging.getLogger("MEGA")

class MegaProvider:
    def __init__(self, email, password):
        self.mega = Mega()
        self.client = None
        self.email = email
        self.password = password

    def connect(self):
        logger.info("Logging into MEGA...")
        self.client = self.mega.login(self.email, self.password)
        logger.info("Connected.")

    def download_backup(self, remote_folder, mode, specific_filename, staging_dir):
        """
        Finds and downloads the target file.
        Returns: Path to the downloaded file.
        """
        # 1. Resolve the Remote Folder Handle (Do this ONCE)
        logger.info(f"Locating remote folder: '{remote_folder}'...")
        folder_node = self.client.find(remote_folder)
        
        if not folder_node:
            raise FileNotFoundError(f"Remote folder '{remote_folder}' not found in MEGA.")
        
        # 'find' returns a tuple: (handle_id, metadata). We need index 0.
        target_folder_handle = folder_node[0]

        # 2. Get file list
        files = self.client.get_files()
        logger.info(f"Scanning {len(files)} files in MEGA...")
        
        # 3. Filter logic
        candidates = []
        for node_id, data in files.items():
            try:
                # Ensure data has attributes ('a') and is a dictionary
                if isinstance(data, dict) and 'a' in data:
                    name = data['a'].get('n', '')
                    parent_handle = data['p']
                    
                    # COMPARISON FIX: Compare file's parent handle vs target folder handle
                    if parent_handle == target_folder_handle:
                        if name.endswith('.zip'):
                            ts = data.get('ts', 0)
                            candidates.append({
                                'id': node_id, 
                                'data': data,
                                'n': name, 
                                'ts': ts
                            })
                            logger.debug(f"Candidate found: {name}")
            except Exception as e:
                logger.debug(f"Skipping node {node_id}: {e}")
                continue

        if not candidates:
            raise FileNotFoundError(f"No .zip backup files found in folder '{remote_folder}'")

        # 4. Select the specific file
        target_node = None
        
        if mode == "SPECIFIC":
            match = next((f for f in candidates if f['n'] == specific_filename), None)
            if not match: 
                raise FileNotFoundError(f"File '{specific_filename}' not found in '{remote_folder}'.")
            target_node = match
        else:
            # LATEST: Sort by timestamp descending
            candidates.sort(key=lambda x: x['ts'], reverse=True)
            target_node = candidates[0]

        # 5. Download
        os.makedirs(staging_dir, exist_ok=True)
        output_path = os.path.join(staging_dir, target_node['n'])
        
        try:
            logger.info(f"Downloading {target_node['n']}...")
            
            # IMPROVEMENT: Use direct download instead of generating public links
            # Passing the tuple (id, data) allows download without a public key
            self.client.download((target_node['id'], target_node['data']), dest_path=staging_dir)
            
            logger.info(f"Downloaded successfully to {output_path}")
            
        except Exception as e:
            logger.error(f"Download failed: {e}")
            raise
        
        return output_path