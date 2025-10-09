

def get_filename_from_file_data(file_data):
    """
    Get the filename from a file data dict.
    """
    return file_data.get('a', {}).get('n', '')


def get_version_from_filename(filename: str):
    """
    Get the version number from a filename.
    """
    import re
    regex = r"_v(\d+)"
    
    regexed = re.search(regex, filename)
    if not regexed:
        return 0
    
    return int(regexed.group(1))


def get_year_week_from_filename(filename):
    """
    Get the year and week number from a filename.
    Returns (year, week) as integers, or (0, 0) if no match found.
    """
    import re
    # Updated regex to handle optional version suffixes like _v3
    regex = r"(?:images|manifest)_(\d{4})-W(\d{2})(?:_v\d+)?"
    
    regexed = re.search(regex, filename)
    
    if not regexed:
        return 0, 0
    
    # Extract year and week, convert to integers
    year = int(regexed.group(1))
    week = int(regexed.group(2))
    
    return year, week


def sort_files_by_version(files_list):
    """
    Sort a list of files by version number.
    """
    return sorted(files_list, key=get_version_from_filename)


def sort_files_by_filename(files_list):
    """
    Sort a list of files by filename.
    """
    return sorted(files_list, key=get_filename_from_file_data)

def sort_files_by_year_week(files_list):
    """
    Sort a list of files by year and week number.
    """
    return sorted(files_list, key=get_year_week_from_filename)

def sort_files_by_timestamp(files_list, descending=True):
    """
    Sort a list of files by timestamp.
    """
    return sorted(files_list, key=lambda x: x.get('ts', 0), reverse=descending)

