import os
import logging

class LoggerMixin:
    def __init__(self):
        os.makedirs('logs', exist_ok=True)
        environment = os.getenv("ENV", "production")
        log_level = logging.DEBUG if environment == "development" else logging.INFO
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(log_level)
        formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        self.logger.handlers = [logging.StreamHandler(), logging.FileHandler('logs/backup.log')]
        self.logger.handlers[0].setFormatter(formatter)
        self.logger.handlers[1].setFormatter(formatter)

    def log_info(self, message: str) -> None:
        self.logger.info(f"[LOG]: {message}")
        
    def log_error(self, message: str) -> None:
        self.logger.error(f"[ERROR]: {message}")
        
    def log_warning(self, message: str) -> None:
        self.logger.warning(f"[WARNING]: {message}")    
    
    def log_debug(self, message: str) -> None:
        self.logger.debug(f"[DEBUG]: {message}")
        
    def log_critical(self, message: str) -> None:
        self.logger.critical(f"[CRITICAL]: {message}")
    
    
        
