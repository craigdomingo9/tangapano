import json
from typing import List

class ManifestMixin:
    """
    Implements 'get_known_hashes' by utilizing the host's 
    'read_file' and 'upload_file' methods.
    """
    
    MANIFEST_FILE = "manifest.json"

    def get_known_hashes(self) -> set[str]:
        content = self.read_file(self.MANIFEST_FILE, logger=self.logger)
        
        if content is None:
            return set()
        try:   
            data = json.loads(content)
            
            return {entry['hash'] for entry in data.get('backups', [])}
        except json.JSONDecodeError:
            self.logger.log_error("Failed to decode manifest JSON content.")
            return set()

    def sync_manifest(self, local_file_path: str) -> bool:
        # TODO: Implement full sync logic using self.read_file() and self.upload_file()
        
        return True