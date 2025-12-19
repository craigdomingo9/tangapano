import subprocess
import os
import logging
from systems.base_restore import BaseRestoreSystem
from utils import file_ops

class SQLRestoreSystem(BaseRestoreSystem):
    def perform_restore(self, zip_path: str):
        # 1. Extract the SQL file from the zip
        logging.info("Extracting SQL dump from archive...")
        sql_file_path = file_ops.unzip_first_file(zip_path, self.config.STAGING_DIR)
        
        if not sql_file_path.endswith('.sql'):
            logging.warning(f"Extracted file {sql_file_path} does not look like .sql")

        # 2. Prepare Environment for pg_dump/psql
        env = os.environ.copy()
        env['PGPASSWORD'] = self.config.POSTGRES_PASSWORD

        # 3. Execute subprocess
        logging.info(f"Restoring Database {self.config.POSTGRES_DB} from {sql_file_path}...")
        
        try:
            with open(sql_file_path, 'r') as f:
                subprocess.run(
                    [
                        'psql',
                        '-h', self.config.POSTGRES_HOST,
                        '-U', self.config.POSTGRES_USER,
                        '-d', self.config.POSTGRES_DB
                    ],
                    stdin=f,
                    env=env,
                    check=True
                )
            logging.info("Database restore subprocess finished successfully.")
            
        except subprocess.CalledProcessError as e:
            logging.error("PSQL subprocess failed.")
            raise e
