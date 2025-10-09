from dotenv import load_dotenv
import os

load_dotenv()

# POSTGRES
POSTGRES_HOST = os.getenv('POSTGRES_HOST', 'db')
POSTGRES_USER = os.getenv('POSTGRES_USER', 'postgres')
POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD')
POSTGRES_DB = os.getenv('POSTGRES_DB')

# DB BACKUP
DB_BACKUP_DIR = os.getenv('DB_BACKUP_DIR', '/app/backups/db')
DB_BACKUP_INTERVAL = int(os.getenv('DB_BACKUP_INTERVAL', 14400))  # 4 hours
DB_BACKUP_KEEP_COUNT = int(os.getenv('DB_BACKUP_KEEP_COUNT', 28))

# MEGA
MEGA_EMAIL = os.getenv('MEGA_EMAIL')
MEGA_PASSWORD = os.getenv('MEGA_PASSWORD')
MEGA_DB_FOLDER = os.getenv('MEGA_DB_FOLDER', 'db-daily-backups')
