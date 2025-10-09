

def get_filename_from_file_data(file_data):
    """
    Get the filename from a file data dict.
    """
    return file_data.get('a', {}).get('n', '')


def sort_files_by_filename(files_list):
    """
    Sort a list of files by filename.
    """
    return sorted(files_list, key=get_filename_from_file_data)

def sort_files_by_timestamp(files_list, descending=True):
    """
    Sort a list of files by timestamp.
    """
    return sorted(files_list, key=lambda x: x.get('ts', 0), reverse=descending)

