#!/bin/bash
# test_pgbouncer.sh

echo "=== Testing PgBouncer Configuration ==="

# Test 1: Check if files exist
echo "1. Checking configuration files..."
if [ -f "pgbouncer/pgbouncer.ini" ] && [ -f "pgbouncer/userlist.txt" ]; then
    echo "   ✓ Configuration files found"
else
    echo "   ✗ Missing configuration files"
    exit 1
fi

# Test 2: Check if PgBouncer is running
echo "2. Checking PgBouncer status..."
if docker-compose ps pgbouncer | grep -q "Up"; then
    echo "   ✓ PgBouncer is running"
else
    echo "   ✗ PgBouncer is not running"
    exit 1
fi

# Test 3: Test connection through PgBouncer
echo "3. Testing database connection through PgBouncer..."
if docker-compose exec web timeout 10 psql "postgres://postgres:root@pgbouncer:6432/tangapano" -c "SELECT 1;" 2>/dev/null; then
    echo "   ✓ Connection through PgBouncer successful"
else
    echo "   ✗ Connection through PgBouncer failed"
    exit 1
fi

echo "=== All tests passed! ==="