import docker
from docker.errors import APIError
from docker.models.containers import Container
from typing import Tuple, List
import logging

log = logging.getLogger(__name__)

class ActionEngine:
    """Executes restart commands by finding containers via labels."""
    
    def __init__(self):
        try:
            self.client = docker.from_env()
            self.client.ping()
            log.info("Successfully connected to Docker API.")
        except Exception as e:
            log.critical(f"Failed to connect to Docker API: {e}")
            self.client = None

    def _get_containers_by_label(self, label_selector: str) -> List[Container]:
        """Finds all running containers that match a given label."""
        if self.client is None:
            return []
        
        try:
            # client.containers.list() returns a list of Container objects
            # We filter them using the 'label' filter & all=True to include stopped containers
            return self.client.containers.list(
                all=True,
                filters={"label": label_selector}
            )
        except APIError as e:
            log.error(f"Docker API Error while listing containers: {e}")
            return []

    def execute_restart_by_label(self, label_selector: str) -> Tuple[bool, str]:
        """
        Finds ALL containers matching the label and restarts them.
        
        Args:
            label_selector: The "key=value" string for the label.
            
        Returns:
            A tuple of (success: bool, summary_message: str).
        """
        if self.client is None:
            return (False, "Docker client not initialized.")
            
        containers_to_restart = self._get_containers_by_label(label_selector)
        
        if not containers_to_restart:
            return (False, f"No running containers found for label: {label_selector}")
            
        log.info(f"Found {len(containers_to_restart)} container(s) for label '{label_selector}'")
        
        success_count = 0
        fail_count = 0
        
        for container in containers_to_restart:
            try:
                log.info(f"Issuing restart for container: {container.name}")
                container.restart()
                success_count += 1
            except APIError as e:
                log.error(f"Failed to restart container {container.name}: {e}")
                fail_count += 1
        
        summary = (
            f"Restart summary for label '{label_selector}': "
            f"Successful={success_count}, Failed={fail_count}"
        )
        
        # We return True if at least one restart was successful
        return (success_count > 0, summary)

