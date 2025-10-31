import yaml
from typing import List, Dict, Any
import logging

log = logging.getLogger(__name__)

class ConfigLoader:
    """Loads and validates the service configuration file."""
    
    def __init__(self, config_path: str):
        self.config_path = config_path

    def load_services(self) -> List[Dict[str, Any]]:
        """Loads the services from the YAML file."""
        try:
            with open(self.config_path, 'r') as f:
                config_data = yaml.safe_load(f)
            
            services = config_data.get('services', [])
            if not services:
                log.warning("Config file loaded, but no 'services' found.")
            
            # Basic validation
            for s in services:
                if 'name' not in s or 'type' not in s or 'check_target' not in s:
                    raise ValueError(f"Service config is missing required fields: {s}")
            return services
        except FileNotFoundError:
            log.critical(f"Config file not found at: {self.config_path}")
            raise
        except Exception as e:
            log.critical(f"Error loading or parsing config file: {e}")
            raise

