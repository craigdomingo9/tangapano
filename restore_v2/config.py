import os
import sys

class Config:
    # --- General ---
    RESTORE_TYPE = os.getenv("RESTORE_TYPE", "IMAGES").upper() # IMAGES or SQL
    RESTORE_MODE = os.getenv("RESTORE_MODE", "LATEST").upper() # LATEST or SPECIFIC
    
    # Target Selection
    TARGET_FILE = os.getenv("TARGET_FILE") # Required if SPECIFIC
    REMOTE_FOLDER = os.getenv("REMOTE_FOLDER", "/Backups") # Where to look in MEGA
    
    # Credentials
    MEGA_EMAIL = os.getenv("MEGA_EMAIL")
    MEGA_PASSWORD = os.getenv("MEGA_PASSWORD")
    
    # Staging
    STAGING_DIR = os.getenv("STAGING_DIR", "/app/data/restore_temp")
    
    # --- Image Specific ---
    RESTORE_DESTINATION = os.getenv("RESTORE_DESTINATION", "/app/data/images")
    NUCLEAR_WIPE = os.getenv("NUCLEAR_WIPE", "false").lower() == "true"

    # --- SQL Specific ---
    POSTGRES_HOST = os.getenv("POSTGRES_HOST", "db")
    POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_DB = os.getenv("POSTGRES_DB", "postgres")
    POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")

    @classmethod
    def validate(cls):
        """Validates environment based on the RESTORE_TYPE."""
        missing = []
        if not cls.MEGA_EMAIL or not cls.MEGA_PASSWORD:
            missing.append("MEGA_EMAIL/PASSWORD")

        if cls.RESTORE_MODE == "SPECIFIC" and not cls.TARGET_FILE:
            missing.append("TARGET_FILE (required for SPECIFIC mode)")

        # Type Specific Validation
        if cls.RESTORE_TYPE == "SQL":
            if not cls.POSTGRES_PASSWORD: missing.append("POSTGRES_PASSWORD")
            if not cls.POSTGRES_DB: missing.append("POSTGRES_DB")

        if missing:
            print(f"[CRITICAL] Missing Env Vars: {', '.join(missing)}")
            sys.exit(1)
        
        # Ensure staging exists
        os.makedirs(cls.STAGING_DIR, exist_ok=True)
