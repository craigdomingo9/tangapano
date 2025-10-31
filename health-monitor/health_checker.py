import requests
import socket
from typing import Tuple

class HealthChecker:
    """Performs the health check for a given service."""
    
    def perform_check(self, check_type: str, target: str) -> Tuple[bool, str]:
        """Public method to dispatch to the correct check type."""
        if check_type == "http":
            return self._check_http(target)
        elif check_type == "ping":
            return self._check_ping(target)
        else:
            return (False, f"Unknown check type: {check_type}")

    def _check_http(self, target_url: str) -> Tuple[bool, str]:
        """Checks an HTTP(S) endpoint."""
        try:
            response = requests.get(target_url, timeout=5)
            if 200 <= response.status_code < 300:
                return (True, f"HTTP {response.status_code}")
            else:
                return (False, f"HTTP {response.status_code}")
        except requests.RequestException as e:
            return (False, f"Request failed: {e}")

    def _check_ping(self, target_address: str) -> Tuple[bool, str]:
        """Checks a raw TCP port (a 'ping')."""
        try:
            host, port_str = target_address.split(':')
            port = int(port_str)
        except (ValueError, AttributeError):
            return (False, f"Invalid 'ping' target format. Expected 'host:port', got '{target_address}'")
        
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(3.0)  # 3-second timeout
            try:
                s.connect((host, port))
                return (True, f"Port {port} is open")
            except (socket.timeout, ConnectionRefusedError, socket.error) as e:
                return (False, f"Port check failed for {host}:{port}: {e}")
            