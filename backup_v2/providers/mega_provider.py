from interfaces import ICloudProvider
from mixins import LoggerMixin, RetryMixin, ManifestMixin

class MEGAProvider(ICloudProvider, LoggerMixin, RetryMixin, ManifestMixin):
    def connect(self) -> bool:
        # TODO: AWS Auth
        return True

    def upload_file(self, local_path: str, remote_path: str = '') -> bool:
        # TODO: Boto3 PutObject
        # Note: We can call self.sync_manifest(local_path) here safely
        return True

    def read_file(self, remote_path: str) -> str:
        # TODO: Boto3 GetObject -> read() -> decode('utf-8')
        return "{}"
    
    def get_known_hashes(self) -> set[str]:
        return set()
    