from abc import ABC, abstractmethod
from typing import Optional, List

class IBackupProvider(ABC):
    @abstractmethod
    def create_local_backup(self, ignore_hashes: Optional[List[str]] = None) -> Optional[str]:
        """
        Creates a backup artifact.
        Returns: File path (str) or None if skipped due to hash match.
        """
        pass