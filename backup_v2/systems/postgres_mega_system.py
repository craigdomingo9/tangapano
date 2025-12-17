from providers import MEGAProvider, PostgresProvider
from interfaces import ICloudProvider, IBackupProvider, IBackupSystem

class PostgresMegaSystem(IBackupSystem):
    def __init__(self):
        """
        Initializes the Postgres Mega System with its specific configuration.
        """
        self.system_name = "Postgres Mega System"
        self.source = PostgresProvider()
        self.dest = MEGAProvider()
        
    def run_cycle(self):
        """
        Executes the full backup lifecycle for the Postgres Mega System configuration.
        """
        print("Running backup cycle for Postgres Mega System...")
        if not self.dest.connect(): return

        # 2. Get Intelligence (Bridge Pattern)
        known_hashes = self.dest.get_known_hashes()

        # 3. Create Backup (Source Deduplication)
        artifact = self.source.create_local_backup(ignore_hashes=known_hashes)

        # 4. Upload (Destination Deduplication/Manifest Update)
        if artifact:
            self.dest.upload_file(artifact)
        print("Backup cycle completed for Postgres Mega System.")


