from datetime import datetime
import os
import subprocess
import zipfile
import time
from .logger_mixins import LoggerMixin


class PostgresMixin():
    """
    Mixin class providing PostgreSQL-specific functionality.
    """
    
    def _create_pgpass_file(self, password, host='localhost', user='postgres'):
        """
        Creates a .pgpass file for PostgreSQL authentication.
        """
        pgpass_content = f"{host}:*:*:{user}:{password}\n"
        pgpass_path = os.path.join(os.path.expanduser("~"), ".pgpass")
        
        with open(pgpass_path, 'w') as pgpass_file:
            pgpass_file.write(pgpass_content)
        
        os.chmod(pgpass_path, 0o600)
        return pgpass_path

    def wait_for_postgres(self, user, host, password, logger: LoggerMixin | None = None):
        """
        Waits for PostgreSQL to be available.
        """
        
        if not logger:
            raise ValueError("Logger instance is required")
        
        logger.log_info("Waiting for PostgreSQL to be available...")
        while True:
            try:
                env = os.environ.copy()
                env['PGPASSFILE'] = self._create_pgpass_file(password, host=host, user=user)
                subprocess.run(
                    ['pg_isready', '-h', host, '-U', user],
                    check=True,
                    env=env,
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL
                )
                logger.log_info("Database is ready. Starting backup service.")
                break
            except subprocess.CalledProcessError:
                logger.log_info("Database not ready yet, retrying in 5 seconds...")
                time.sleep(5)
    
    
    def dump_database_to_file(self, user, host, db_name, backup_dir, password, logger: LoggerMixin | None = None) -> str | None:
        """
        Dumps the PostgreSQL database to a SQL file.
        """
        
        if not logger:
            raise ValueError("Logger instance is required")
        
        os.makedirs(backup_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        file_name = f"db_backup_{timestamp}.sql"
        backup_path = os.path.join(backup_dir, file_name)
        
        env = os.environ.copy()
        env['PGPASSFILE'] = self._create_pgpass_file(
            password=password, host=host, user=user
        )
        
        try:
            with open(backup_path, 'w') as backup_file:
                subprocess.run([
                'pg_dump',
                '-h', host,
                '-U', user,
                '-d', db_name,
                '--clean',
                '--if-exists'
            ], stdout=backup_file, env=env, check=True)
            return backup_path
        except subprocess.CalledProcessError:
            logger.log_error("Failed to dump the database.")
            return None