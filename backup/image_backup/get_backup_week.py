from datetime import datetime

def get_backup_week(dt=None):
    """
    Get the ISO year and week number for a given datetime.
    
    Args:
        dt: datetime object (defaults to now)
    
    Returns:
        tuple: (iso_year, iso_week)
    """
    if dt is None:
        dt = datetime.now()
    iso_year, iso_week, _ = dt.date().isocalendar()
    return iso_year, iso_week
