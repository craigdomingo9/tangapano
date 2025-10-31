
import logging

_logger = None

def get_logger():
    global _logger
    if _logger is None:
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('monitor.log'),
                logging.StreamHandler()
            ]
        )
        _logger = logging.getLogger(__name__)
    return _logger
