from typing import Optional, List
from interfaces.backup_interface import IBackupProvider
from mixins.backup_mixins import CompressionMixin

class DirectoryBackup(IBackupProvider, CompressionMixin):
    def __init__(self, folder_path: str):
        self.folder_path = folder_path

    def _hash_current_state(self) -> str:
        # TODO: Implement directory hashing logic
        return "fake_hash_123"

    def create_local_backup(self, ignore_hashes: Optional[List[str]] = None) -> Optional[str]:
        # 1. Check hash against ignore_hashes
        # 2. If new, run self.compress_file()
        # 3. Return path or None
        pass