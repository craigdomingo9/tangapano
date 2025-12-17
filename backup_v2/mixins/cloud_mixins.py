from time import sleep
from typing import Any, Callable

from mixins.logger_mixins import LoggerMixin

class RetryMixin:
    def retry_operation(
        self,
        func: Callable[[], Any],
        max_retries: int = 3,
        retry_delay: int = 5,
        logger: LoggerMixin | None = None
    ) -> Any:
        if logger is None:
            raise ValueError("LoggerMixin instance is required for logging.")
        
        for attempt in range(max_retries):
            try:
                return func()
            except Exception as e:
                logger.log_error(
                    f"Attempt {attempt + 1} failed: {e}"
                )
                if attempt < max_retries - 1:
                    logger.log_info("Retrying...")
                    sleep(retry_delay * (attempt + 1))
                else:
                    raise e
