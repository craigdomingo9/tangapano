FROM python:3.9-slim

# Install system dependencies including PostgreSQL client
RUN apt-get update && apt-get install -y \
    postgresql-client \
    nano \
    dos2unix \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . /app

# Convert to unix file
RUN dos2unix ./entrypoint.sh
# Make entrypoint executable
RUN chmod +x ./entrypoint.sh

# Create backup directories
RUN mkdir -p /app/backups/db /app/backups/images

# Run the backup services
CMD ["./entrypoint.sh"]