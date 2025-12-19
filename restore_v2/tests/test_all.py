import os
import sys
import tempfile
import zipfile
import logging
from pathlib import Path
from unittest.mock import patch, MagicMock, call

import pytest

# Add parent to path
sys.path.insert(0, str(Path(__file__).parent.parent))


# ============================================================================
# FIXTURES
# ============================================================================

@pytest.fixture
def temp_dir():
    """Temporary directory for all tests."""
    temp = tempfile.mkdtemp()
    yield temp
    import shutil
    shutil.rmtree(temp, ignore_errors=True)


@pytest.fixture
def zip_file(temp_dir):
    """Create a test zip file."""
    zip_path = os.path.join(temp_dir, "test.zip")
    with zipfile.ZipFile(zip_path, 'w') as zf:
        zf.writestr("file1.txt", "content1")
        zf.writestr("backup.sql", "SELECT 1;")
    return zip_path


@pytest.fixture
def corrupt_file(temp_dir):
    """Create a corrupt (non-zip) file."""
    corrupt_path = os.path.join(temp_dir, "corrupt.zip")
    with open(corrupt_path, 'w') as f:
        f.write("This is not a zip file")
    return corrupt_path


@pytest.fixture
def clean_env():
    """Clean environment variables."""
    original = os.environ.copy()
    for key in ['RESTORE_TYPE', 'RESTORE_MODE', 'TARGET_FILE', 'MEGA_EMAIL', 'MEGA_PASSWORD']:
        os.environ.pop(key, None)
    yield
    os.environ.clear()
    os.environ.update(original)


# ============================================================================
# CONFIG TESTS
# ============================================================================

class TestConfig:
    """Test configuration handling."""
    
    def test_config_defaults(self, clean_env):
        """Test default config values."""
        import importlib
        import config
        importlib.reload(config)
        
        assert config.Config.RESTORE_TYPE == "IMAGES"
        assert config.Config.RESTORE_MODE == "LATEST"
        # RESTORE_DESTINATION may be set from environment
        assert config.Config.RESTORE_DESTINATION is not None
    
    def test_config_from_env(self, clean_env):
        """Test config from environment variables."""
        os.environ['RESTORE_TYPE'] = 'SQL'
        os.environ['RESTORE_MODE'] = 'SPECIFIC'
        
        import importlib
        import config
        importlib.reload(config)
        
        assert config.Config.RESTORE_TYPE == "SQL"
        assert config.Config.RESTORE_MODE == "SPECIFIC"
    
    def test_nuclear_wipe_flag(self, clean_env):
        """Test nuclear wipe boolean parsing."""
        os.environ['NUCLEAR_WIPE'] = 'true'
        
        import importlib
        import config
        importlib.reload(config)
        
        assert config.Config.NUCLEAR_WIPE is True
    
    @patch('sys.exit')
    @patch('os.makedirs')
    def test_validate_missing_mega_email(self, mock_makedirs, mock_exit, clean_env):
        """Test validation fails when MEGA_EMAIL is missing."""
        import importlib
        import config
        importlib.reload(config)
        config.Config.MEGA_EMAIL = None
        config.Config.MEGA_PASSWORD = "password"
        
        with patch('builtins.print'):
            config.Config.validate()
            mock_exit.assert_called_with(1)
    
    @patch('sys.exit')
    @patch('os.makedirs')
    def test_validate_missing_mega_password(self, mock_makedirs, mock_exit, clean_env):
        """Test validation fails when MEGA_PASSWORD is missing."""
        import importlib
        import config
        importlib.reload(config)
        config.Config.MEGA_EMAIL = "test@mega.co.nz"
        config.Config.MEGA_PASSWORD = None
        
        with patch('builtins.print'):
            config.Config.validate()
            mock_exit.assert_called_with(1)
    
    @patch('sys.exit')
    @patch('os.makedirs')
    def test_validate_missing_postgres_password_sql_mode(self, mock_makedirs, mock_exit, clean_env):
        """Test validation fails when POSTGRES_PASSWORD missing in SQL mode."""
        import importlib
        import config
        importlib.reload(config)
        config.Config.MEGA_EMAIL = "test@mega.co.nz"
        config.Config.MEGA_PASSWORD = "password"
        config.Config.RESTORE_TYPE = "SQL"
        config.Config.POSTGRES_PASSWORD = None
        
        with patch('builtins.print'):
            config.Config.validate()
            mock_exit.assert_called_with(1)


# ============================================================================
# FILE OPERATIONS TESTS
# ============================================================================

class TestFileOps:
    """Test file operations utilities."""
    
    def test_verify_valid_zip(self, zip_file):
        """Test verification of valid zip."""
        from utils import file_ops
        
        # Should not raise
        file_ops.verify_zip(zip_file)
    
    def test_verify_corrupt_zip(self, corrupt_file):
        """Test verification of corrupt zip."""
        from utils import file_ops
        
        with pytest.raises(ValueError):
            file_ops.verify_zip(corrupt_file)
    
    def test_unzip_to_dir(self, zip_file, temp_dir):
        """Test unzipping files."""
        from utils import file_ops
        
        extract_dir = os.path.join(temp_dir, "extracted")
        os.makedirs(extract_dir)
        
        file_ops.unzip_to_dir(zip_file, extract_dir)
        
        assert os.path.exists(os.path.join(extract_dir, "file1.txt"))
        assert os.path.exists(os.path.join(extract_dir, "backup.sql"))
    
    def test_unzip_first_file(self, zip_file, temp_dir):
        """Test extracting first file from zip."""
        from utils import file_ops
        
        extract_dir = os.path.join(temp_dir, "extracted")
        os.makedirs(extract_dir)
        
        result = file_ops.unzip_first_file(zip_file, extract_dir)
        
        assert result.endswith((".txt", ".sql"))
        assert os.path.exists(result)
    
    def test_nuclear_wipe_dir(self, temp_dir):
        """Test directory wiping."""
        from utils import file_ops
        
        test_dir = os.path.join(temp_dir, "to_wipe")
        os.makedirs(test_dir)
        
        # Create files
        open(os.path.join(test_dir, "file1.txt"), 'w').close()
        open(os.path.join(test_dir, "file2.txt"), 'w').close()
        
        assert len(os.listdir(test_dir)) == 2
        
        file_ops.nuclear_wipe_dir(test_dir)
        
        assert len(os.listdir(test_dir)) == 0


# ============================================================================
# MEGA PROVIDER TESTS
# ============================================================================

class TestMegaProvider:
    """Test MEGA provider."""
    
    @patch('providers.mega_provider.Mega')
    def test_connect(self, mock_mega):
        """Test connection to MEGA."""
        from providers.mega_provider import MegaProvider
        
        mock_mega.return_value.login.return_value = MagicMock()
        provider = MegaProvider("test@mega.co.nz", "password")
        provider.connect()
        
        assert provider.client is not None
        provider.mega.login.assert_called_once()
    
    @patch('providers.mega_provider.Mega')
    def test_download_latest_backup(self, mock_mega):
        """Test downloading latest backup."""
        from providers.mega_provider import MegaProvider
        
        mock_client = MagicMock()
        mock_mega.return_value.login.return_value = mock_client
        
        # Mock file listing
        mock_files = {
            'node1': {'a': {'n': 'old.zip'}, 'ts': 1000, 'h': 'h1'},
            'node2': {'a': {'n': 'new.zip'}, 'ts': 2000, 'h': 'h2'},
        }
        mock_client.get_files.return_value = mock_files
        
        provider = MegaProvider("test@mega.co.nz", "password")
        provider.client = mock_client
        
        result = provider.download_backup("/Backups", "LATEST", None, "/tmp")
        
        assert "new.zip" in result
    
    @patch('providers.mega_provider.Mega')
    def test_download_specific_backup(self, mock_mega):
        """Test downloading specific backup."""
        from providers.mega_provider import MegaProvider
        
        mock_client = MagicMock()
        mock_mega.return_value.login.return_value = mock_client
        
        mock_files = {
            'node1': {'a': {'n': 'backup1.zip'}, 'ts': 1000, 'h': 'h1'},
            'node2': {'a': {'n': 'backup2.zip'}, 'ts': 2000, 'h': 'h2'},
        }
        mock_client.get_files.return_value = mock_files
        
        provider = MegaProvider("test@mega.co.nz", "password")
        provider.client = mock_client
        
        result = provider.download_backup("/Backups", "SPECIFIC", "backup1.zip", "/tmp")
        
        assert "backup1.zip" in result


# ============================================================================
# FACTORY TESTS
# ============================================================================

class TestFactory:
    """Test factory pattern."""
    
    def test_factory_image_restore(self):
        """Test factory creates image restore."""
        from factories.restore_factory import RestoreSystemFactory
        from systems.image_restore import ImageRestoreSystem
        
        system = RestoreSystemFactory.get_system("IMAGES")
        assert isinstance(system, ImageRestoreSystem)
    
    def test_factory_sql_restore(self):
        """Test factory creates SQL restore."""
        from factories.restore_factory import RestoreSystemFactory
        from systems.sql_restore import SQLRestoreSystem
        
        system = RestoreSystemFactory.get_system("SQL")
        assert isinstance(system, SQLRestoreSystem)
    
    def test_factory_unknown_type(self):
        """Test factory rejects unknown type."""
        from factories.restore_factory import RestoreSystemFactory
        
        with pytest.raises(ValueError):
            RestoreSystemFactory.get_system("UNKNOWN")


# ============================================================================
# RESTORE SYSTEMS TESTS
# ============================================================================

class TestRestoreSystems:
    """Test restore system implementations."""
    
    @patch('systems.image_restore.BaseRestoreSystem.__init__', lambda x: None)
    @patch('systems.image_restore.file_ops')
    def test_image_restore_without_wipe(self, mock_file_ops):
        """Test image restore without nuclear wipe."""
        from systems.image_restore import ImageRestoreSystem
        
        system = ImageRestoreSystem()
        system.config = MagicMock()
        system.config.RESTORE_DESTINATION = "/images"
        system.config.NUCLEAR_WIPE = False
        
        system.perform_restore("/tmp/backup.zip")
        
        mock_file_ops.unzip_to_dir.assert_called_once_with("/tmp/backup.zip", "/images")
    
    @patch('systems.image_restore.BaseRestoreSystem.__init__', lambda x: None)
    @patch('systems.image_restore.file_ops')
    def test_image_restore_with_wipe(self, mock_file_ops):
        """Test image restore with nuclear wipe."""
        from systems.image_restore import ImageRestoreSystem
        
        system = ImageRestoreSystem()
        system.config = MagicMock()
        system.config.RESTORE_DESTINATION = "/images"
        system.config.NUCLEAR_WIPE = True
        
        system.perform_restore("/tmp/backup.zip")
        
        mock_file_ops.nuclear_wipe_dir.assert_called_once_with("/images")
        mock_file_ops.unzip_to_dir.assert_called_once()
    
    @patch('systems.sql_restore.BaseRestoreSystem.__init__', lambda x: None)
    @patch('builtins.open', create=True)
    @patch('systems.sql_restore.subprocess.run')
    @patch('systems.sql_restore.file_ops')
    def test_sql_restore_success(self, mock_file_ops, mock_subprocess, mock_open):
        """Test SQL restore success."""
        from systems.sql_restore import SQLRestoreSystem
        
        system = SQLRestoreSystem()
        system.config = MagicMock()
        system.config.STAGING_DIR = "/tmp"
        system.config.POSTGRES_HOST = "db"
        system.config.POSTGRES_USER = "postgres"
        system.config.POSTGRES_DB = "appdb"
        system.config.POSTGRES_PASSWORD = "secret"
        
        mock_file_ops.unzip_first_file.return_value = "/tmp/backup.sql"
        mock_open.return_value.__enter__ = MagicMock()
        mock_open.return_value.__exit__ = MagicMock()
        
        system.perform_restore("/tmp/backup.zip")
        
        # Verify psql was called
        mock_subprocess.assert_called_once()
        call_args = mock_subprocess.call_args[0][0]
        assert "psql" in call_args


# ============================================================================
# LIFECYCLE TESTS
# ============================================================================

class TestLifecycle:
    """Test restore lifecycle."""
    
    @patch('systems.image_restore.file_ops')
    @patch('systems.base_restore.Config')
    @patch('systems.base_restore.MegaProvider')
    @patch('systems.base_restore.file_ops')
    @patch('os.makedirs')
    def test_complete_lifecycle(self, mock_makedirs, mock_base_file_ops, mock_mega_class, mock_config, mock_image_file_ops):
        """Test complete restore lifecycle."""
        from systems.image_restore import ImageRestoreSystem
        
        # Setup
        mock_config.RESTORE_TYPE = "IMAGES"
        mock_config.STAGING_DIR = "/tmp"
        mock_config.REMOTE_FOLDER = "/Backups"
        mock_config.RESTORE_MODE = "LATEST"
        mock_config.TARGET_FILE = None
        mock_config.MEGA_EMAIL = "test@mega.co.nz"
        mock_config.MEGA_PASSWORD = "password"
        mock_config.RESTORE_DESTINATION = "/app/media"
        mock_config.NUCLEAR_WIPE = False
        
        mock_mega_instance = MagicMock()
        mock_mega_class.return_value = mock_mega_instance
        mock_mega_instance.download_backup.return_value = "/tmp/backup.zip"
        
        mock_base_file_ops.verify_zip.return_value = None
        mock_base_file_ops.nuclear_wipe_dir.return_value = None
        mock_image_file_ops.unzip_to_dir.return_value = None
        
        # Execute
        system = ImageRestoreSystem()
        system.run_lifecycle()
        
        # Verify order
        mock_mega_instance.connect.assert_called_once()
        mock_mega_instance.download_backup.assert_called_once()
        mock_base_file_ops.verify_zip.assert_called_once()
    
    @patch('systems.base_restore.Config')
    @patch('systems.base_restore.MegaProvider')
    @patch('systems.base_restore.file_ops')
    @patch('os.makedirs')
    def test_lifecycle_cleanup_on_error(self, mock_makedirs, mock_file_ops, mock_mega_class, mock_config):
        """Test cleanup happens even on error."""
        from systems.image_restore import ImageRestoreSystem
        
        mock_config.RESTORE_TYPE = "IMAGES"
        mock_config.STAGING_DIR = "/tmp"
        mock_config.REMOTE_FOLDER = "/Backups"
        mock_config.RESTORE_MODE = "LATEST"
        mock_config.TARGET_FILE = None
        mock_config.MEGA_EMAIL = "test@mega.co.nz"
        mock_config.MEGA_PASSWORD = "password"
        
        mock_mega_instance = MagicMock()
        mock_mega_class.return_value = mock_mega_instance
        mock_mega_instance.connect.side_effect = Exception("Connection failed")
        
        mock_file_ops.nuclear_wipe_dir.return_value = None
        
        system = ImageRestoreSystem()
        
        with pytest.raises(Exception):
            system.run_lifecycle()
        
        # Cleanup should still be called
        mock_file_ops.nuclear_wipe_dir.assert_called()


# ============================================================================
# ADDITIONAL ERROR HANDLING TESTS
# ============================================================================

class TestErrorHandling:
    """Test error scenarios and edge cases."""
    
    @patch('providers.mega_provider.Mega')
    def test_download_specific_file_not_found(self, mock_mega):
        """Test error when specific backup not found."""
        from providers.mega_provider import MegaProvider
        
        mock_client = MagicMock()
        mock_mega.return_value.login.return_value = mock_client
        
        mock_files = {
            'node1': {'a': {'n': 'backup1.zip'}, 'ts': 1000, 'h': 'h1'},
        }
        mock_client.get_files.return_value = mock_files
        
        provider = MegaProvider("test@mega.co.nz", "password")
        provider.client = mock_client
        
        with pytest.raises(FileNotFoundError, match="not found"):
            provider.download_backup("/Backups", "SPECIFIC", "nonexistent.zip", "/tmp")
    
    @patch('providers.mega_provider.Mega')
    def test_download_no_backups_found(self, mock_mega):
        """Test error when no backups available."""
        from providers.mega_provider import MegaProvider
        
        mock_client = MagicMock()
        mock_mega.return_value.login.return_value = mock_client
        
        # No ZIP files
        mock_files = {
            'node1': {'a': {'n': 'readme.txt'}, 'ts': 1000, 'h': 'h1'},
        }
        mock_client.get_files.return_value = mock_files
        
        provider = MegaProvider("test@mega.co.nz", "password")
        provider.client = mock_client
        
        with pytest.raises(FileNotFoundError, match="No backups found"):
            provider.download_backup("/Backups", "LATEST", None, "/tmp")
    
    @patch('systems.sql_restore.BaseRestoreSystem.__init__', lambda x: None)
    @patch('systems.sql_restore.subprocess.run')
    @patch('systems.sql_restore.file_ops')
    def test_sql_restore_subprocess_error(self, mock_file_ops, mock_subprocess):
        """Test error handling when PSQL subprocess fails."""
        import subprocess
        from systems.sql_restore import SQLRestoreSystem
        
        system = SQLRestoreSystem()
        system.config = MagicMock()
        system.config.STAGING_DIR = "/tmp"
        system.config.POSTGRES_HOST = "db"
        system.config.POSTGRES_USER = "postgres"
        system.config.POSTGRES_DB = "appdb"
        system.config.POSTGRES_PASSWORD = "secret"
        
        mock_file_ops.unzip_first_file.return_value = "/tmp/backup.sql"
        mock_subprocess.side_effect = subprocess.CalledProcessError(1, "psql")
        
        with pytest.raises(subprocess.CalledProcessError):
            system.perform_restore("/tmp/backup.zip")
    
    def test_unzip_empty_zip_file(self, temp_dir):
        """Test error when ZIP is empty."""
        from utils import file_ops
        
        # Create empty zip
        import zipfile
        empty_zip = os.path.join(temp_dir, "empty.zip")
        with zipfile.ZipFile(empty_zip, 'w') as zf:
            pass  # Create empty
        
        extract_dir = os.path.join(temp_dir, "extracted")
        os.makedirs(extract_dir)
        
        with pytest.raises(ValueError, match="empty"):
            file_ops.unzip_first_file(empty_zip, extract_dir)


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
