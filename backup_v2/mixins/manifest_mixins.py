import json
from typing import List

class ManifestMixin:
    """
    Implements 'get_known_hashes' by utilizing the host's 
    'read_file' and 'upload_file' methods.
    """
    
    MANIFEST_FILE = "manifest.json"

    # NOTE: We do not define abstract methods here. 
    # We assume 'self' adheres to ICloudProvider.

    def get_known_hashes(self) -> List[str]:
        try:
            # Uses the Interface's standard method
            content = self.read_file(self.MANIFEST_FILE)
            data = json.loads(content)
            return [item['hash'] for item in data.get('backups', [])]
        except Exception:
            return []

    def sync_manifest(self, local_file_path: str) -> bool:
        # TODO: Implement full sync logic using self.read_file() and self.upload_file()
        
        return True