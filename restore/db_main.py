from db_restore import *
import os, sys, argparse
from mega_utils import login_mega


logger = get_logger()



def main():
    """Main function to handle command line arguments and coordinate restore"""
    parser = argparse.ArgumentParser(description='Restore PostgreSQL database from backup')
    parser.add_argument('--source', choices=['mega', 'local'], default='mega',
                      help='Backup source (default: mega)')
    parser.add_argument('--backup', help='Specific backup file to restore')
    parser.add_argument('--list', action='store_true', help='List available backups and exit')
    
    args = parser.parse_args()
    
    # Login to MEGA
    mega_instance = login_mega(MEGA_EMAIL, MEGA_PASSWORD, logger)
    

    # List available backups if requested
    if args.list:
        backups = list_available_backups(backup_source=args.source)
        if backups:
            print("Available backups (newest first):")
            for timestamp, filename in backups:
                print(f"  {timestamp.strftime('%Y-%m-%d %H:%M:%S')} - {filename}")
        else:
            print("No backups found")
        sys.exit(0)
        
    # Get backup file
    if args.backup:
        # Use specified backup
        if args.source == 'mega':
            # Download from MEGA
            os.makedirs(DB_BACKUP_DIR, exist_ok=True)
            backup_path = download_backup_from_mega(mega_instance, args.backup, DB_BACKUP_DIR)
            if not backup_path:
                sys.exit(1)
        else:
            # Use local backup
            backup_path = os.path.join(DB_BACKUP_DIR, args.backup)
            if not os.path.exists(backup_path):
                logger.error(f"Backup file not found: {backup_path}")
                sys.exit(1)
    else:
        # Use latest backup
        backups = list_available_backups(mega_instance=mega_instance, backup_source=args.source)
        if not backups:
            logger.error("No backups found")
            sys.exit(1)
        
        timestamp, backup_filename = backups[0]
        logger.info(f"Using latest backup: {backup_filename} from {timestamp}")
        
        if args.source == 'mega':
            # Download from MEGA
            os.makedirs(DB_BACKUP_DIR, exist_ok=True)
            backup_path = download_backup_from_mega(mega_instance, backup_filename, DB_BACKUP_DIR)
            if not backup_path:
                sys.exit(1)
        else:
            # Use local backup
            backup_path = os.path.join(DB_BACKUP_DIR, backup_filename)

    # Perform restore
    success = restore_database(backup_path)
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()




