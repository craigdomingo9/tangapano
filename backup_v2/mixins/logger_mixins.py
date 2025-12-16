import logging

class LoggerMixin:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(logging.INFO)
        formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        self.logger.handlers = [logging.StreamHandler(), logging.FileHandler('logs/backup.log')]
        self.logger.handlers[0].setFormatter(formatter)
        self.logger.handlers[1].setFormatter(formatter)

    def log(self, message: str) -> None:
        self.logger.info(f"[LOG]: {message}")
