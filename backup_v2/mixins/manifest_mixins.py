from typing import List

class ManifestMixin:
    """
    Requires host class to implement:
    - download_file_to_memory(remote_path) -> str
    - upload_text(content, remote_path) -> bool
    """
    
    MANIFEST_FILE = "manifest.json"

    def get_known_hashes(self) -> List[str]:
        """Downloads manifest and extracts list of existing hashes."""
        # TODO: Implement download and JSON parsing
        return []

    def sync_manifest(self, local_file_path: str) -> bool:
        """
        Checks if local file exists in manifest. 
        If no, updates manifest in memory and uploads new version.
        Returns: True if file should be uploaded, False if duplicate.
        """
        # TODO: Implement hash check and manifest update
        return True
