


def logger():
    """
    Initialize a logger for the backup_db module

    Returns a configured logger object
    """
    import logging

    # Configure logging to both file and console
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            # Log to file
            logging.FileHandler('backup_db.log'),
            # Log to console
            logging.StreamHandler()
        ]
    )

    # Get the logger object
    logger = logging.getLogger(__name__)

    return logger

