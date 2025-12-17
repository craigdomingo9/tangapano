import zipfile
import os

class CompressionMixin:
    def compress_file(self, file_path: str, output_path: str, mode: str = "single") -> str:
        if mode == "single":
            with zipfile.ZipFile(output_path, 'w', compression=zipfile.ZIP_DEFLATED) as zipf:
                zipf.write(file_path, os.path.basename(file_path))
        elif mode == "multiple":
            with zipfile.ZipFile(output_path, 'w', compression=zipfile.ZIP_DEFLATED) as zipf:
                for root, dirs, files in os.walk(file_path):
                    for file in files:
                        file_path = os.path.join(root, file)
                        arc_path = os.path.relpath(file_path, file_path)
                        zipf.write(file_path, arc_path, compress_type=zipfile.ZIP_DEFLATED)
        else:
            raise ValueError("Invalid compression mode. Use 'single' or 'multiple'.")
        
        return output_path
    
    def verify_compression(self, zip_path: str) -> bool:
        try:
            with zipfile.ZipFile(zip_path, 'r') as zipf:
                bad_file = zipf.testzip()
                return bad_file is None
        except zipfile.BadZipFile:
            return False