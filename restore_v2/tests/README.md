# Restore Service Tests

Simple, streamlined test suite for the restore microservice.

## Quick Start

```bash
# Install dependencies
pip install -r ../requirements.txt

# Run all tests
pytest test_all.py -v

# Or use the test runner script
cd ..
python run_tests.py
```

## Test Structure

All tests are in **`test_all.py`** organized into 6 test classes:

| Class                | Tests | Purpose                              |
| -------------------- | ----- | ------------------------------------ |
| `TestConfig`         | 3     | Configuration loading and parsing    |
| `TestFileOps`        | 5     | File operations (zip, extract, wipe) |
| `TestMegaProvider`   | 3     | MEGA cloud connectivity              |
| `TestFactory`        | 3     | Restore system factory pattern       |
| `TestRestoreSystems` | 3     | Image and SQL restore logic          |
| `TestLifecycle`      | 2     | Complete workflow and error handling |

**Total: 19 tests**

## Running Tests

```bash
# All tests
pytest test_all.py -v

# Specific test class
pytest test_all.py::TestConfig -v

# Specific test
pytest test_all.py::TestConfig::test_config_defaults -v

# Tests matching pattern
pytest test_all.py -k "lifecycle" -v
```

## What's Covered

✅ **Configuration** - Defaults, env vars, parsing  
✅ **File Operations** - ZIP verification, extraction, cleanup  
✅ **MEGA Provider** - Connection, download (latest & specific)  
✅ **Factory Pattern** - System creation, error handling  
✅ **Restore Systems** - Image & SQL restore logic  
✅ **Lifecycle** - Complete workflow, error recovery

## Test Dependencies

- pytest
- pytest-mock
- freezegun
- mega-py

All in `requirements.txt`.
