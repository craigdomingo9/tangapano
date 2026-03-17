import os
from providers import MEGAProvider, PostgresProvider
from interfaces import IBackupSystem

class PostgresMegaSystem(IBackupSystem):
    def __init__(self):
        """
        Initializes the Postgres Mega System with its specific configuration.
        """
        self.system_name = "Postgres Mega System"
        self.source = PostgresProvider()
        # self.dest = MEGAProvider()
        self.dest = MegatoolsProvider()
        self.folder_name = os.getenv("MEGA_DB_FOLDER", "db-daily_v2-backups-test")
        
    def run_cycle(self):
        """
        Executes the full backup lifecycle for the Postgres Mega System configuration.
        """
        print("Running backup cycle for Postgres Mega System...")
        if not self.dest.connect(): return

        # Create Backup (Source Deduplication)
        artifact = self.source.create_local_backup()

        # Upload
        if artifact:
            self.dest.upload_file(artifact, remote_folder=self.folder_name)
        print("Backup cycle completed for Postgres Mega System.")
