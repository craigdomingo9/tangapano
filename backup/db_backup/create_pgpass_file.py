import os
from .utils import get_logger
from .env_file import POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD

logger = get_logger()


# Use .pgpass file or psql connection string instead
def create_pgpass_file():
    if not POSTGRES_PASSWORD or not POSTGRES_USER or not POSTGRES_HOST:
        logger.error("Missing required environment variables: POSTGRES_PASSWORD, POSTGRES_USER, and POSTGRES_HOST must be set")
        return None
    
    # Use user-specific temp directory
    import tempfile
    temp_dir = tempfile.gettempdir()
    pgpass_path = os.path.join(temp_dir, f".pgpass_{os.getuid()}")
    
    try:
        with open(pgpass_path, 'w') as f:
            f.write(f"{POSTGRES_HOST}:*:*:{POSTGRES_USER}:{POSTGRES_PASSWORD}")
        os.chmod(pgpass_path, 0o600)
        return pgpass_path
    except Exception as e:
        logger.error(f"Error creating .pgpass file: {e}")
        return None
