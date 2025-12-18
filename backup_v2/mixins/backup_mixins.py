import os
import zipfile

class CompressionMixin:
    def compress_file(self, source_path: str, output_path: str, mode: str = "single", filter_func=None) -> str | None:
        """
        Compresses a file or directory. 
        filter_func: Optional function that returns True if a file should be included.
        """
        source_path = os.path.abspath(source_path)
        
        # Ensure output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        if mode == "single":
            with zipfile.ZipFile(output_path, 'w', compression=zipfile.ZIP_DEFLATED) as zipf:
                zipf.write(source_path, os.path.basename(source_path))

        elif mode == "multiple":
            with zipfile.ZipFile(output_path, 'w', compression=zipfile.ZIP_DEFLATED, allowZip64=True) as zipf:
                file_count = 0
                for root, dirs, files in os.walk(source_path):
                    for file in files:
                        full_path = os.path.join(root, file)
                        
                        # --- 1. Apply Filter (Integration with Weekly System) ---
                        if filter_func:
                            if not filter_func(os.path.getmtime(full_path)):
                                continue 
                        
                        # --- 2. Fix Relative Path Bug ---
                        # We calculate path relative to the input 'source_path', not itself.
                        arc_path = os.path.relpath(full_path, source_path)
                        zipf.write(full_path, arc_path)
                        file_count += 1
                
                # If filter skipped everything, return None so we don't upload empty zips
                if file_count == 0:
                    return None

        else:
            raise ValueError("Invalid compression mode. Use 'single' or 'multiple'.")
        
        return output_path

    def verify_compression(self, zip_path: str) -> bool:
        if not zip_path or not os.path.exists(zip_path):
            return False
        try:
            with zipfile.ZipFile(zip_path, 'r') as zipf:
                bad_file = zipf.testzip()
                return bad_file is None
        except zipfile.BadZipFile:
            return False