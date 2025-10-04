import os
from dotenv import load_dotenv
from .utils import logger


logger = logger()

# Load environment variables from a .env file if present
load_dotenv()

# Load postgres environment variables
POSTGRES_HOST = os.getenv('POSTGRES_HOST', 'db')
POSTGRES_USER = os.getenv('POSTGRES_USER', 'postgres')
POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD')


# Use .pgpass file or psql connection string instead
def create_pgpass_file():
    if not POSTGRES_PASSWORD or not POSTGRES_USER or not POSTGRES_HOST:
        logger.error("Missing required environment variables: POSTGRES_PASSWORD, POSTGRES_USER, and POSTGRES_HOST must be set")
        return None
    
    pgpass_content = f"{POSTGRES_HOST}:*:*:{POSTGRES_USER}:{POSTGRES_PASSWORD}"
    pgpass_path = "/tmp/.pgpass"
    try:
        with open(pgpass_path, 'w') as f:
            f.write(pgpass_content)
        os.chmod(pgpass_path, 0o600)
    except Exception as e:
        logger.error(f"Error creating .pgpass file: {e}")
        return None
    
    return pgpass_path
