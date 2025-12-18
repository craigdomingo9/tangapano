import pytest
from systems.image_backup_system import ImageBackupSystem

def test_nuclear_mode_trigger(mocker, monkeypatch, mega_provider):
    """
    GOAL: If I set NUCLEAR_INIT=true, does the system switch into nuclear mode?
    """
    # 1. Set the Flag
    monkeypatch.setenv("NUCLEAR_INIT", "true")

    # 2. Mock the components
    # We don't want to actually zip files, so we mock DirectoryProvider
    mock_dir_class = mocker.patch("systems.image_backup_system.DirectoryProvider")
    mock_dir_instance = mock_dir_class.return_value
    # Pretend zipping finished and returned a path
    mock_dir_instance.create_zip_all.return_value = "/tmp/nuclear_winter.zip"

    # Inject our pre-made Mega Provider mock
    mocker.spy(mega_provider, "safe_upload") # <--- FIX: Create a Spy
    mocker.patch("systems.image_backup_system.MEGAProvider", return_value=mega_provider)
    
    # Mock cleanup
    mocker.patch("os.remove")
    mocker.patch("os.rename")
    mocker.patch("os.path.exists", return_value=True)

    # 3. Run the System
    system = ImageBackupSystem()
    system.run_cycle()

    # 4. Verify Logic Flow
    # Did it use the NUCLEAR method?
    mock_dir_instance.create_zip_all.assert_called_once()
    mock_dir_instance.create_zip_current_week.assert_not_called()

    # Did it pass the file to safe_upload?
    mega_provider.safe_upload.assert_called_with(
        local_path="/tmp/nuclear_winter.zip",
        remote_folder="/TestBackups"
    )
