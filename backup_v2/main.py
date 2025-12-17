from providers import MEGAProvider, PostgresProvider
from interfaces import ICloudProvider, IBackupProvider


class BackupSystem:
    def __init__(self, source: IBackupProvider, dest: ICloudProvider):
        self.source = source
        self.dest = dest

    def run_cycle(self):
        # 1. Connect
        if not self.dest.connect(): return

        # 2. Get Intelligence (Bridge Pattern)
        known_hashes = self.dest.get_known_hashes()

        # 3. Create Backup (Source Deduplication)
        artifact = self.source.create_local_backup(ignore_hashes=known_hashes)

        # 4. Upload (Destination Deduplication/Manifest Update)
        if artifact:
            self.dest.upload_file(artifact)

def main():
    db_system_mega = BackupSystem(
        source=PostgresProvider(),
        dest=MEGAProvider()
    )

    db_system_mega.run_cycle()
    
    print("Hello, Backup V2!")

    
if __name__ == "__main__":
    main()


