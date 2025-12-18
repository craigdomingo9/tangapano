import json
import os
import hashlib
import time

from mixins.logger_mixins import LoggerMixin

class ManifestMixin:
    """
    Implements 'get_known_hashes' by utilizing the host's 
    'read_file' and 'upload_file' methods.
    """
    
    MANIFEST_FILE = "manifest.json"
    
    def _calculate_hash(self, file_path: str) -> str:
        file_hash = hashlib.sha256()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                file_hash.update(chunk)
        return file_hash.hexdigest()

    def get_known_hashes(self, key: str, logger: LoggerMixin | None) -> set[str]:
        if logger is None:
            raise ValueError("Logger instance is required.")
            
        content = self.read_file(self.MANIFEST_FILE, logger=logger)
        
        if content is None:
            return set()
        try:   
            data = json.loads(content)
            
            return {entry['hash'] for entry in data.get(key, [])}
        except json.JSONDecodeError:
            logger.log_error("Failed to decode manifest JSON content.")
            return set()

    def sync_manifest(self, key: str, local_file_path: str, logger: LoggerMixin | None = None) -> bool:
        """
        Syncs a file with the manifest.
        """
        
        if logger is None:
            raise ValueError("Logger instance is required.")
        
        file_hash = self._calculate_hash(local_file_path)
        file_size = os.path.getsize(local_file_path)
        file_name = os.path.basename(local_file_path)
        
        try:
            content = self.read_file(self.MANIFEST_FILE, logger=logger)
            if content:
                manifest = json.loads(content)
            else:
                manifest = {}
        except Exception as e:
            logger.log_error(f"Error reading manifest: {e}")
            manifest = {"system": "backup-v2", key: []}
        
        existing_hashes = {entry['hash'] for entry in manifest.get(key, [])}
        if file_hash in existing_hashes:
            logger.log_info(f"File '{file_name}' already in manifest. Skipping update.")
            return True
        
        new_entry = {
            "file_name": file_name,
            "hash": file_hash,
            "timestamp": int(time.time()),
            "size_bytes": file_size
        }
        manifest.setdefault(key, []).append(new_entry)
        manifest["last_updated"] = int(time.time())
        
        return True