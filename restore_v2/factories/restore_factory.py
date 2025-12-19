from systems.image_restore import ImageRestoreSystem
from systems.sql_restore import SQLRestoreSystem

class RestoreSystemFactory:
    @staticmethod
    def get_system(restore_type: str):
        if restore_type == "IMAGES":
            return ImageRestoreSystem()
        elif restore_type == "SQL":
            return SQLRestoreSystem()
        else:
            raise ValueError(f"Unknown RESTORE_TYPE: {restore_type}")
