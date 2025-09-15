#!/bin/sh


# Start the database restore service in the background
echo "Starting database restore service"
python /app/restore_db.py &

# Start the image restore service in the background
echo "Starting image restore service"
python /app/restore_images.py &

# Wait for all background processes to complete
wait

