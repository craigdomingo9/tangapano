from abc import ABC, abstractmethod

class ICloudProvider(ABC):
    @abstractmethod
    def connect(self) -> bool:
        """Establishes connection."""
        pass

    @abstractmethod
    def upload_file(self, file_path: str) -> bool:
        """Uploads file. Should check manifest before actual upload."""
        pass