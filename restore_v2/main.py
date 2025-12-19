import logging
from config import Config
from factories.restore_factory import RestoreSystemFactory

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [%(levelname)s] - %(name)s - %(message)s'
)
logger = logging.getLogger("Main")

if __name__ == "__main__":
    try:
        # 1. Validate Config
        Config.validate()
        
        # 2. Build System
        system = RestoreSystemFactory.get_system(Config.RESTORE_TYPE)
        logger.info(f"Initialized {type(system).__name__}")
        
        # 3. Run
        system.run_lifecycle()
        
    except Exception as e:
        logger.critical(f"Restore Process Terminated: {e}")
        exit(1)
