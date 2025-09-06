# test_pgbouncer.py
import psycopg2
import time
from django.conf import settings

def test_pgbouncer():
    # Test direct connection to PgBouncer
    conn = psycopg2.connect(
        host=settings.DATABASES['default']['HOST'],
        port=settings.DATABASES['default']['PORT'],
        dbname=settings.DATABASES['default']['NAME'],
        user=settings.DATABASES['default']['USER'],
        password=settings.DATABASES['default']['PASSWORD']
    )
    
    cur = conn.cursor()
    cur.execute("SELECT 1")
    result = cur.fetchone()
    print(f"Test query result: {result}")
    
    # Check if we're connected via PgBouncer
    cur.execute("SELECT usename, application_name, client_addr FROM pg_stat_activity WHERE pid = pg_backend_pid()")
    conn_info = cur.fetchone()
    print(f"Connection info: {conn_info}")
    
    cur.close()
    conn.close()

if __name__ == "__main__":
    test_pgbouncer()