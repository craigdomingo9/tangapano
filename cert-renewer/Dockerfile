# Start with a Python base
FROM python:3.10-slim

# Install the certbot binary
RUN apt-get update && apt-get install -y certbot && apt-get clean

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all scripts
COPY . .

# Make the entrypoint executable
RUN chmod +x /app/entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]

# The default command is to start the renewal scheduler
CMD ["python", "main.py"]