
import logging
import os

_logger = None

def get_logger():
    global _logger
    if _logger is None:
        # Ensure the directory exists inside the container
        os.makedirs('logs', exist_ok=True)
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('logs/monitor.log'),
                logging.StreamHandler()
            ]
        )
        _logger = logging.getLogger(__name__)
    return _logger
