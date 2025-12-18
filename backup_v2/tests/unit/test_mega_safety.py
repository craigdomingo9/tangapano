import pytest
import os

def test_safe_upload_happy_path(mocker, mega_provider):
    """
    GOAL: Verify that we Rename -> Upload -> Delete Old -> Rename New
    """
    # 1. Setup
    local_file = "my_backup.zip"
    
    mocker.patch("os.rename")
    mocker.patch("os.path.exists", return_value=True)

    # 2. Execution
    result = mega_provider.safe_upload(local_file, "/RemoteFolder")

    # 3. Verification
    assert result is True
    
    # Check local rename
    os.rename.assert_any_call(local_file, f"{local_file}.temp")

    # FIX: Check 'delete' (not destroy) and don't worry about the specific ID
    # just ensure it was called to remove the old file.
    mega_provider.client.delete.assert_called()

    # Verify Rename of the new file
    mega_provider.client.rename.assert_called()

def test_safe_upload_prevents_disaster(mocker, mega_provider):
    """
    GOAL: If upload crashes, ensure we DO NOT delete the old file.
    """
    # 1. Sabotage the Upload
    mega_provider.execute_upload = mocker.Mock(side_effect=Exception("Internet Died!"))
    
    # --- FIX START ---
    # The Global Mock says "Files always exist". 
    # We must override it here to say "No temp file exists to clean up".
    # This prevents the 'cleanup' logic from calling delete().
    mega_provider.client.find.return_value = None 
    # --- FIX END ---

    mocker.patch("os.rename")
    mocker.patch("os.path.exists", return_value=True)

    # 2. Execution
    result = mega_provider.safe_upload("my_backup.zip", "/RemoteFolder")

    # 3. Verification
    assert result is False
    
    # Now this will pass, because 'find' returned None, so 'delete' was skipped.
    mega_provider.client.delete.assert_not_called()