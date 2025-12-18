import os
import datetime
from interfaces.backup_interface import IBackupProvider
from mixins import CompressionMixin

class DirectoryProvider(CompressionMixin, IBackupProvider):
    def __init__(self, path: str, output_path: str):
        self.root_path = os.path.abspath(path)
        self.output_path = os.path.abspath(output_path)
        if not os.path.exists(self.root_path):
            raise ValueError(f"Source directory does not exist: {self.root_path}")

    def _is_in_current_week(self, timestamp: float) -> bool:
        file_date = datetime.date.fromtimestamp(timestamp)
        today = datetime.date.today()
        return file_date.isocalendar()[:2] == today.isocalendar()[:2]

    def create_zip_all(self, output_name: str) -> str | None:
        """Nuclear Mode"""
        return self._compress_files_wrapper(output_name, filter_func=None)

    def create_zip_current_week(self, output_name: str) -> str | None:
        """Standard Mode"""
        return self._compress_files_wrapper(output_name, filter_func=self._is_in_current_week)

    def create_local_backup(self, **kwargs) -> str | None:
        """
        REQUIRED by IBackupProvider.
        Acts as a default entry point. 
        If specific logic isn't called, we default to 'Current Week'.
        """
        # 1. Determine a name if one wasn't provided
        output_name = kwargs.get('output_name', 'default_image_backup.zip')
        
        # 2. Check for optional overrides (flexibility)
        nuclear = kwargs.get('nuclear', False)

        # 3. Route to the correct logic
        if nuclear:
            return self.create_zip_all(output_name)
        else:
            return self.create_zip_current_week(output_name)

    def _compress_files_wrapper(self, output_name, filter_func):
        """Helper to bridge between this class and the Mixin"""
        output_path = os.path.join(self.output_path, output_name)
        
        result = self.compress_file(
            source_path=self.root_path,
            output_path=output_path,
            mode="multiple",
            filter_func=filter_func
        )
        
        if result and self.verify_compression(result):
            return result
        return None