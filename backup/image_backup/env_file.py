import os
from dotenv import load_dotenv

load_dotenv()

# Configuration from environment variables or defaults.
IMAGES_SOURCE_DIR = os.getenv('IMAGES_SOURCE_DIR', '/app/media')
IMAGES_BACKUP_DIR = os.getenv('IMAGES_BACKUP_DIR', '/app/backups/images')
IMAGES_BACKUP_INTERVAL = int(os.getenv('IMAGES_BACKUP_INTERVAL', 14400))
MEGA_EMAIL = os.getenv('MEGA_EMAIL')
MEGA_PASSWORD = os.getenv('MEGA_PASSWORD')
MEGA_IMAGES_FOLDER = os.getenv('MEGA_IMAGES_FOLDER', 'media-weekly-backups')
PACK_ALL_INTO_ONE_ZIP = bool(os.getenv('PACK_ALL_INTO_ONE_ZIP', False))
