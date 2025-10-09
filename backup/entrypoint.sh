#!/bin/sh


# Start the database backup service in the background
echo "Starting database backup service"
python /app/db_main.py &

# Start the image backup service in the background
echo "Starting image backup service"
python /app/image_main.py &

# Wait for all background processes to complete
wait

