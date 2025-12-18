import os
import datetime
from interfaces.system_interface import IBackupSystem
from providers import DirectoryProvider
from providers import MEGAProvider

class ImageBackupSystem(IBackupSystem):
    def __init__(self):
        # 1. Initialize Source (Local Disk)
        # We assume DirectoryProvider uses your new CompressionMixin logic
        source_path = os.getenv("IMAGE_SOURCE_DIR", "/app/data/images")
        output_path = os.getenv("IMAGE_BACKUP_DIR", "/tmp/backups/images")
        self.source = DirectoryProvider(path=source_path, output_path=output_path)
        
        # 2. Initialize Destination (MEGA Cloud)
        self.dest = MEGAProvider()

        # 3. Configuration Flags
        self.nuclear_mode = os.getenv("NUCLEAR_INIT", "false").lower() == "true"
        self.remote_folder = os.getenv("MEGA_REMOTE_FOLDER", "/WeeklyBackups")

    def _get_target_filename(self) -> str:
        """
        Generates the standard naming convention.
        Format: images_2023_W42.zip
        """
        today = datetime.date.today()
        year, week, _ = today.isocalendar()
        return f"images_{year}_W{week}.zip"

    def run_cycle(self):
        print(f"--- [ImageSystem] Starting Cycle (Nuclear: {self.nuclear_mode}) ---")

        # 1. Connect to Cloud
        # The Provider handles retries internally via RetryMixin
        if not self.dest.connect():
            print("   [Error] Failed to connect to MEGA. Aborting cycle.")
            return

        # 2. Determine Artifact Name
        target_zip_name = self._get_target_filename()
        
        # 3. Create Backup Artifact (Source Logic)
        local_artifact = None
        try:
            if self.nuclear_mode:
                print(f"   [Info] ☢️ NUCLEAR MODE: Zipping ALL images into {target_zip_name}...")
                local_artifact = self.source.create_zip_all(output_name=target_zip_name)
            else:
                print(f"   [Info] Standard Mode: Zipping current week's images into {target_zip_name}...")
                local_artifact = self.source.create_zip_current_week(output_name=target_zip_name)
        except Exception as e:
            print(f"   [Error] Compression failed: {e}")
            return

        # 4. Validation
        if not local_artifact:
            print("   [Info] No eligible files found. Nothing to backup.")
            return

        # 5. Upload (Destination Logic)
        print(f"   [Info] Uploading {local_artifact} to MEGA folder: '{self.remote_folder}'...")
        
        success = self.dest.upload_file(
            local_path=local_artifact,
            remote_folder=self.remote_folder
        )

        # 6. Cleanup & Conclusion
        if success:
            print("   [Success] Backup cycle completed successfully.")
            # Remove the local zip to free up container space
            if os.path.exists(local_artifact):
                os.remove(local_artifact)
                print("   [Cleanup] Local artifact removed.")
        else:
            print("   [Error] Upload failed. Artifact preserved for debugging.")