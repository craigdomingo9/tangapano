from .env_file import *
import os, tempfile, zipfile, subprocess
from .utils import get_logger

logger = get_logger()


def restore_database(backup_path):
    """
    Restore database from backup file
    
    Args:
        backup_path (str): Path to the backup zip file
        
    Returns:
        bool: True if restore succeeded, False otherwise
    """
    # Create temporary directory for extraction
    with tempfile.TemporaryDirectory() as temp_dir:
        try:
            # Extract SQL file from zip
            with zipfile.ZipFile(backup_path, 'r') as zipf:
                sql_files = [
                    f
                    for f in zipf.namelist()
                    if f.endswith('.sql')
                ]
                if not sql_files:
                    logger.error("No SQL file found in backup archive")
                    return False
                
                # Extract to temporary directory
                zipf.extractall(temp_dir)
                sql_path = os.path.join(temp_dir, sql_files[0])

            # Set environment for psql
            env = os.environ.copy()
            env['PGPASSWORD'] = POSTGRES_PASSWORD
            
            # Read the SQL file to check if it contains CREATE DATABASE statement
            with open(sql_path, 'r') as f:
                sql_content = f.read(5000)  # Read first 5KB


            # If the SQL file contains CREATE DATABASE, handle it specially
            if 'CREATE DATABASE' in sql_content.upper():
                logger.info("SQL file contains CREATE DATABASE statements")
                
                # First, connect to postgres database to drop and recreate the target database
                subprocess.run([
                    'psql',
                    '-h', POSTGRES_HOST,
                    '-U', POSTGRES_USER,
                    '-d', 'postgres',
                    '-c', f"DROP DATABASE IF EXISTS {POSTGRES_DB} WITH (FORCE);"
                ], env=env, check=True)
                
                subprocess.run([
                    'psql',
                    '-h', POSTGRES_HOST,
                    '-U', POSTGRES_USER,
                    '-d', 'postgres',
                    '-c', f"CREATE DATABASE {POSTGRES_DB};"
                ], env=env, check=True)
        
            # Restore the database
            with open(sql_path, 'r') as f:
                result = subprocess.run([
                    'psql',
                    '-h', POSTGRES_HOST,
                    '-U', POSTGRES_USER,
                    '-d', POSTGRES_DB
                ], stdin=f, env=env, check=True)
            
            
            if result.returncode == 0:
                logger.info("Database restored successfully")
                return True
            else:
                logger.error(f"Restore failed with error: {result.stderr}")
                return False
        
        except Exception as e:
            logger.error(f"Error during restore: {e}")
            return False
