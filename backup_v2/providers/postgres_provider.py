import os
from mixins import LoggerMixin, CompressionMixin, PostgresMixin
from interfaces import IBackupProvider


class PostgresProvider(IBackupProvider, PostgresMixin, LoggerMixin, CompressionMixin):
    def __init__(self) -> None:
        self.logger = LoggerMixin()
        self.host = os.getenv("POSTGRES_HOST", "db")
        self.user = os.getenv("POSTGRES_USER", "postgres")
        self.password = os.getenv("POSTGRES_PASSWORD", "password")
        self.db_name = os.getenv("POSTGRES_DB", "db")
        self.backup_dir = os.getenv("DB_BACKUP_DIR", "/tmp/backups/db")
    
    def create_local_backup(self) -> str | None:
        self.logger.log_info("Creating PostgreSQL backup...")
        
        self.wait_for_postgres(
            user=self.user,
            host=self.host,
            password=self.password,
            logger=self.logger
        )
        
        self.logger.log_info("PostgreSQL is available. Proceeding with backup.")
        backup_path = self.dump_database_to_file(
            user=self.user,
            host=self.host,
            db_name=self.db_name,
            backup_dir=self.backup_dir,
            password=self.password,
            logger=self.logger
        )
        
        if not backup_path:
            self.logger.log_error("Database dump failed. Backup aborted.")
            return None
        
        self.logger.log_info(f"Database dumped to {backup_path}. Now compressing...")

        compressed_path = self.compress_file(
            file_path=backup_path,
            output_path=f"{backup_path}.zip",
            mode="single"
        )
        
        if not compressed_path:
            self.logger.log_error("Compression failed. Backup aborted.")
            return None

        self.logger.log_info(f"Compressed backup to {compressed_path}")

        return compressed_path
