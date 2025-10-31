import logging
import time
from typing import Dict, Any
from health_checker import HealthChecker
from action_engine import ActionEngine

log = logging.getLogger(__name__)

class MonitorJob:
    """A single, stateful job that monitors one service."""
    
    def __init__(
        self, 
        service_config: Dict[str, Any],
        checker: HealthChecker,
        actor: ActionEngine
    ):
        self.config = service_config
        self.checker = checker
        self.actor = actor
        self.name = self.config['name']
        
    def __call__(self):
        """The main execution method. apscheduler runs this."""
        log.info(f"[{self.name}] Starting health check...")
        
        # 1. First Check
        is_healthy, reason = self.checker.perform_check(
            self.config['type'], 
            self.config['check_target']
        )
        
        if is_healthy:
            log.info(f"[{self.name}] Service is HEALTHY. Reason: {reason}")
            return # Job is done

        # 2b. Service is Unhealthy: Log and Restart
        target_label = self.config['restart_label']
        log.info(f"[{self.name}] Executing restart for all containers with label: {target_label}")
        
        success, output = self.actor.execute_restart_by_label(target_label)
        
        if not success:
            log.error(f"[{self.name}] Restart command FAILED. Output: {output}")
            return # Don't try to re-check if restart failed

        log.info(f"[{self.name}] Restart command summary: {output}")

        # 3. Wait for Cooldown
        time.sleep(self.config.get('cooldown_seconds', 30))
        
        # 4. Re-check
        log.info(f"[{self.name}] Re-checking service after restart...")
        is_healthy, reason = self.checker.perform_check(
            self.config['type'], 
            self.config['check_target']
        )
        
        if is_healthy:
            log.info(f"[{self.name}] RECOVERY SUCCESSFUL. Service is back online.")
        else:
            log.critical(
                f"[{self.name}] RECOVERY FAILED. "
                f"Service is still unhealthy after restart. Reason: {reason}"
            )
            # This is where you would trigger an alert (email, Slack)

