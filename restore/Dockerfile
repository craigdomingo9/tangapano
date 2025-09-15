FROM python:3.9-slim

# Install system dependencies including PostgreSQL client and megatools
RUN apt-get update && apt-get install -y \
    postgresql-client \
    dos2unix \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


# Copy restore scripts
COPY restore_db.py .
COPY restore_images.py .
# Copy wrapper scripts
COPY docker-db-restore.sh .
COPY docker-images-restore.sh .

# Set execution permissions
RUN chmod +x restore_db.py restore_images.py docker-db-restore.sh docker-images-restore.sh

# Convert to unix file
RUN dos2unix ./docker-db-restore.sh
RUN dos2unix ./docker-images-restore.sh

# Create restore directories
RUN mkdir -p /restore/db /restore/images

# Default command (can be overridden)
CMD ["/app/docker-db-restore.sh", "--help"]
