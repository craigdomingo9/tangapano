from mega import Mega
import os


def login_mega(email, password, logger=None):
    try:
        # Check if email and password are set
        if not email or not password:
            if logger:
                logger.error("Please set MEGA_EMAIL and MEGA_PASSWORD environment variables.")
            raise Exception("Please set MEGA_EMAIL and MEGA_PASSWORD environment variables.")
        
        # Initialize Mega
        mega = Mega()
        
        logger.info("Logging in to MEGA...")
        # Attempt to login
        return mega.login(email, password)

    except Exception as e:
        if logger:
            logger.error(f"Error logging in to MEGA: {e}")
        print(f"Error logging in to MEGA: {e}")
        return None
