#!/bin/sh


# Start the database backup service in the background
echo "Starting database backup service"
python /app/backup_db.py &

# Start the image backup service in the background
echo "Starting image backup service"
python /app/backup_images.py &

# Wait for all background processes to complete
wait

