from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

IMAGES_SOURCE_DIR = os.getenv('IMAGES_SOURCE_DIR', '/app/media')
IMAGES_BACKUP_DIR = os.getenv('IMAGES_BACKUP_DIR', '/backups/images')
IMAGES_BACKUP_INTERVAL = int(os.getenv('IMAGES_BACKUP_INTERVAL', 14400))
MEGA_EMAIL = os.getenv('MEGA_EMAIL')
MEGA_PASSWORD = os.getenv('MEGA_PASSWORD')
MEGA_IMAGES_FOLDER = os.getenv('MEGA_IMAGES_FOLDER', 'media-weekly-backups')
