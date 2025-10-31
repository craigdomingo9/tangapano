import docker
from docker.errors import APIError
from docker.models.containers import Container
import logging
import os

# Set up basic logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] (%(name)s) %(message)s")
log = logging.getLogger(__name__)

class DockerReloader:
    """Finds a container by label and executes a command in it."""
    
    def __init__(self):
        try:
            # Connects to the Docker socket mounted at /var/run/docker.sock
            self.client = docker.from_env()
            self.client.ping()
            log.info("Successfully connected to Docker API.")
        except Exception as e:
            log.critical(f"Failed to connect to Docker API: {e}")
            self.client = None

    def find_container_by_label(self, label: str) -> Container | None:
        """Finds the first *running* container with a given label."""
        if self.client is None:
            return None
        try:
            # Find all containers with the given label
            containers = self.client.containers.list(all=True, filters={"label": label})
            if containers:
                return containers[0] # Return the first match
            return None
        except APIError as e:
            log.error(f"Error finding container with label {label}: {e}")
            return None

    def reload_nginx(self):
        """Finds the Nginx container and sends the 'reload' signal."""
        
        # Read the Nginx label from an environment variable
        nginx_label = os.environ.get("NGINX_LABEL", "com.tangapano.service=nginx")
        
        log.info(f"Attempting to find Nginx container with label: {nginx_label}")
        
        container = self.find_container_by_label(nginx_label)
        
        if not container:
            log.error(f"Could not find a running Nginx container with label {nginx_label}.")
            return

        log.info(f"Found Nginx container: {container.name}. Sending 'nginx -s reload'...")
        try:
            # Use exec_run to send the reload command
            exit_code, output = container.exec_run("nginx -s reload")
            
            if exit_code == 0:
                log.info("Nginx reloaded successfully.")
            else:
                log.error(f"Nginx reload command failed (Exit code {exit_code}): {output.decode('utf-8')}")
        except APIError as e:
            log.error(f"Error while trying to reload Nginx: {e}")