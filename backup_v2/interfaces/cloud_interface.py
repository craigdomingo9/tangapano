from abc import ABC, abstractmethod
from typing import List

class ICloudProvider(ABC):
    """
    Standard Contract for ANY cloud provider.
    """

    @abstractmethod
    def connect(self) -> bool:
        pass

    @abstractmethod
    def upload_file(self, local_path: str, remote_path: str = '') -> bool:
        """Standard upload."""
        pass

    @abstractmethod
    def read_file(self, remote_path: str) -> str:
        """Standard read. Returns content as string (or throws error)."""
        pass

    @abstractmethod
    def get_known_hashes(self) -> List[str]:
        """
        Contract: Must return list of hashes. 
        (Implementation can be provided by ManifestMixin or custom logic).
        """
        pass