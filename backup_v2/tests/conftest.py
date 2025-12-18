import pytest
import os
from unittest.mock import MagicMock

# --- FIXTURE 1: The Safe Environment ---
@pytest.fixture(autouse=True)
def mock_env_vars(monkeypatch):
    """
    'autouse=True' means this runs AUTOMATICALLY before every single test.
    'monkeypatch' is a tool to safely modify the environment for the duration of the test.
    
    GOAL: Prevent your tests from accidentally reading your real .env file 
    and nuking your actual production backups.
    """
    monkeypatch.setenv("MEGA_EMAIL", "test_user@example.com")
    monkeypatch.setenv("MEGA_PASSWORD", "fake_password")
    monkeypatch.setenv("IMAGE_SOURCE_DIR", "/tmp/test_images")
    monkeypatch.setenv("NUCLEAR_INIT", "false")
    monkeypatch.setenv("MEGA_IMAGES_FOLDER", "/TestBackups")

# --- FIXTURE 2: The Fake Cloud ---
@pytest.fixture
def mock_mega_client():
    mock = MagicMock()
    mock.login.return_value = True
    
    # 1. Simulate Upload Success
    # Return a dict because that's what mega.py returns
    mock.upload.return_value = {'h': 'new_file_handle'} 
    
    # 2. Simulate "Find" Success (For both Files and Folders)
    # When code asks "Does this folder exist?", say YES.
    # We return a list [node] because mega.find() often returns a list or node
    mock.find.return_value = [{'h': 'folder_handle', 't': 1}] 
    
    # 3. Simulate "Get Files" (If your code iterates)
    mock.get_files.return_value = {'node_id': {'a': {'n': 'filename'}}}
    
    return mock

# --- FIXTURE 3: Your Provider (Injected with the Fake Cloud) ---
@pytest.fixture
def mega_provider(mocker, mock_mega_client):
    """
    Returns a REAL instance of MEGAProvider, but with the 
    underlying 'Mega' library mocked out.
    """
    # 1. Patch the EXTERNAL LIBRARY (mega.py), not your class.
    #    This ensures that when your code says 'm = Mega()', it gets our spy.
    #    Note: We patch where the library is IMPORTED (likely inside the mixin or provider file)
    #    If your code uses 'from mega import Mega', patch 'mega.Mega'.
    mocker.patch("mega.Mega", return_value=mock_mega_client)
    
    # 2. Import the REAL class
    from providers.mega_provider import MEGAProvider
    
    # 3. Instantiate the REAL class
    #    This runs your actual __init__ code.
    provider = MEGAProvider()
    
    # 4. Manually inject the mock client and set connection status
    #    (Since we bypassed the real connect() method in the test setup)
    provider.client = mock_mega_client 
    provider.is_connected = True 
    
    return provider