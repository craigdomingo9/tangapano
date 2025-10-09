import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration from environment variables
POSTGRES_HOST = os.getenv('POSTGRES_HOST', 'db')
POSTGRES_USER = os.getenv('POSTGRES_USER', 'postgres')
POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD')
POSTGRES_DB = os.getenv('POSTGRES_DB')
DB_BACKUP_DIR = os.getenv('DB_BACKUP_DIR', '/backups/db')

# MEGA
MEGA_EMAIL = os.getenv('MEGA_EMAIL')
MEGA_PASSWORD = os.getenv('MEGA_PASSWORD')
MEGA_DB_FOLDER = os.getenv('MEGA_DB_FOLDER', 'db-daily-backups')
