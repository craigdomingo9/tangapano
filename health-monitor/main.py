from apscheduler.schedulers.blocking import BlockingScheduler
from config_loader import ConfigLoader
from health_checker import HealthChecker
from action_engine import ActionEngine
from monitor import MonitorJob
from logger import get_logger

log = get_logger()


def main():
    log.info("--- Starting Health Monitor Service ---")
    
    # 1. Initialize shared components
    config_loader = ConfigLoader(config_path="services.yaml")
    health_checker = HealthChecker()
    action_engine = ActionEngine()
    
    # 2. Load services
    try:
        services = config_loader.load_services()
        log.info(f"Loaded {len(services)} services from config.")
    except Exception as e:
        log.critical(f"Failed to load config, shutting down: {e}")
        return

    # 3. Initialize the scheduler
    scheduler = BlockingScheduler()
    
    # 4. Create and schedule one job for each service
    for service_config in services:
        job = MonitorJob(
            service_config=service_config,
            checker=health_checker,
            actor=action_engine
        )
        
        scheduler.add_job(
            job,
            'interval',
            seconds=service_config.get('interval_seconds', 60),
            name=service_config['name']
        )
        log.info(f"Scheduled job for '{service_config['name']}' to run every {service_config.get('interval_seconds', 60)}s")

    # 5. Start the service
    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        log.info("--- Shutting Down Health Monitor Service ---")
        scheduler.shutdown()

if __name__ == "__main__":
    main()
