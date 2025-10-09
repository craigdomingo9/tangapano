import os
import time
import subprocess
from dotenv import load_dotenv
from .create_pgpass_file import create_pgpass_file
from .utils import get_logger

logger = get_logger()

# Load environment variables from a .env file if present
load_dotenv()

# Configuration from environment variables
POSTGRES_HOST = os.getenv('POSTGRES_HOST', 'db')
POSTGRES_USER = os.getenv('POSTGRES_USER', 'postgres')

def wait_for_database():
    """
    Wait until the PostgreSQL database becomes available.

    This function repeatedly checks the database readiness using pg_isready.
    It blocks until the database is ready to accept connections.
    """
    if logger:
        logger.info("Waiting for database to be ready...")
    while True:
        try:
            env = os.environ.copy()
            env['PGPASSFILE'] = create_pgpass_file()
            subprocess.run(
                ['pg_isready', '-h', POSTGRES_HOST, '-U', POSTGRES_USER],
                check=True,
                env=env,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
            if logger:
                logger.info("Database is ready. Starting backup service.")
            break
        except subprocess.CalledProcessError:
            if logger:
                logger.info("Database not ready yet, retrying in 5 seconds...")
            time.sleep(5)

