import os, sys, argparse
from mega_utils import login_mega
from image_restore import *

logger = get_logger()


def main():
    """Main function to handle command line arguments and coordinate restore"""
    parser = argparse.ArgumentParser(description='Restore images from backup')
    parser.add_argument('--source', choices=['mega', 'local'], default='mega',
                      help='Backup source (default: mega)')
    parser.add_argument('--backups', nargs='+', help='Specific backup files to restore')
    parser.add_argument('--weeks', nargs='+', help='Restore backups from specific weeks (format: YYYY-WW)')
    parser.add_argument('--list', action='store_true', help='List available backups and exit')
    
    args = parser.parse_args()

    # Login to MEGA
    mega_instance = login_mega(MEGA_EMAIL, MEGA_PASSWORD, logger)
    
    if not mega_instance:
        logger.error("MEGA login failed. Exiting.")
        sys.exit(1)

    # List available backups if requested
    if args.list:
        backups = list_available_backups(mega_instance=mega_instance, backup_source=args.source)
        if backups:
            print("Available backups (newest first):")
            for year, week, filename in backups:
                print(f"  {year}-W{week:02d} - {filename}")
        else:
            print("No backups found")
        sys.exit(0)

    # Determine which backups to restore
    backup_paths = []
    
    if args.backups:
        # Use specified backups
        for backup_name in args.backups:
            if args.source == 'mega':
                # Download from MEGA
                weekly_dir = os.path.join(IMAGES_BACKUP_DIR, 'weekly')
                os.makedirs(weekly_dir, exist_ok=True)
                backup_path = download_backup_from_mega(backup_name, weekly_dir, mega_instance=mega_instance)
                if backup_path:
                    backup_paths.append(backup_path)
            else:
                # Use local backup
                backup_path = os.path.join(IMAGES_BACKUP_DIR, 'weekly', backup_name)
                if os.path.exists(backup_path):
                    backup_paths.append(backup_path)
                else:
                    logger.error(f"Backup file not found: {backup_path}")
    
    elif args.weeks:
        # Use backups from specified weeks
        all_backups = list_available_backups(mega_instance=mega_instance, backup_source=args.source)
        weekly_dir = os.path.join(IMAGES_BACKUP_DIR, 'weekly')
        
        for week_str in args.weeks:
            # Parse week string (format: YYYY-WW)
            try:
                parts = week_str.split('-')
                if len(parts) != 2 or not parts[1].startswith('W'):
                    raise ValueError
                
                year = int(parts[0])
                week = int(parts[1].replace('W', ''))
                
                # Find backup for this week
                found = False
                for backup_year, backup_week, backup_name in all_backups:
                    if backup_year == year and backup_week == week:
                        if args.source == 'mega':
                            # Download from MEGA
                            os.makedirs(weekly_dir, exist_ok=True)
                            backup_path = download_backup_from_mega(backup_name, weekly_dir, mega_instance=mega_instance)
                            if backup_path:
                                backup_paths.append(backup_path)
                                found = True
                                break
                        else:
                            # Use local backup
                            backup_path = os.path.join(weekly_dir, backup_name)
                            if os.path.exists(backup_path):
                                backup_paths.append(backup_path)
                                found = True
                                break
                
                if not found:
                    logger.warning(f"No backup found for week {week_str}")
                    
            except ValueError:
                logger.error(f"Invalid week format: {week_str}. Use YYYY-WW format.")
    
    else:
        # Use all available backups
        all_backups = list_available_backups(mega_instance=mega_instance, backup_source=args.source)
        weekly_dir = os.path.join(IMAGES_BACKUP_DIR, 'weekly')
        
        for year, week, backup_name in all_backups:
            if args.source == 'mega':
                # Download from MEGA
                os.makedirs(weekly_dir, exist_ok=True)
                backup_path = download_backup_from_mega(backup_name, weekly_dir, mega_instance=mega_instance)
                if backup_path:
                    backup_paths.append(backup_path)
            else:
                # Use local backup
                backup_path = os.path.join(weekly_dir, backup_name)
                if os.path.exists(backup_path):
                    backup_paths.append(backup_path)

    if not backup_paths:
        logger.error("No backup files found to restore")
        sys.exit(1)

    # Perform restore
    success = restore_images(backup_paths, IMAGES_SOURCE_DIR)
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
