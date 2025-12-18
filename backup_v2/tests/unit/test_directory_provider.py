import os
import time
import zipfile
from freezegun import freeze_time
from providers import DirectoryProvider

# --- HELPER FUNCTION ---
def create_dummy_file(folder, filename, days_ago):
    """Creates a fake file and tricks the OS into thinking it's old."""
    path = folder / filename
    path.write_text("dummy content")
    
    # Rewind the file's modification clock
    past_time = time.time() - (days_ago * 86400)
    os.utime(path, (past_time, past_time))
    return path

# --- THE TEST ---
def test_standard_mode_filters_correctly(tmp_path):
    """
    Scenario: It is Wednesday. We have a file from Monday (Keep) 
    and a file from last month (Ignore).
    """
    # 1. Stop Time! It is now Wednesday, Oct 18th, 2023.
    with freeze_time("2023-10-18"):
        
        # 2. Setup the "Filesystem"
        # tmp_path is a pytest fixture that gives us a temporary folder unique to this test.
        create_dummy_file(tmp_path, "keep_me.jpg", days_ago=2)  # Monday (This week)
        create_dummy_file(tmp_path, "ignore_me.jpg", days_ago=20) # Last Month

        # 3. Run Your Code
        provider = DirectoryProvider(path=str(tmp_path), output_path="/tmp/backups/test-images")
        # This calls your mixin logic
        zip_output = provider.create_zip_current_week("weekly_test.zip")

    # 4. Assertions (The Verification)
    assert zip_output is not None
    
    # Open the real zip file created and check contents
    with zipfile.ZipFile(zip_output, 'r') as z:
        files = z.namelist()
        print(f"Files inside zip: {files}") # Printed only if test fails
        
        assert "keep_me.jpg" in files
        assert "ignore_me.jpg" not in files
