FROM python:3.9-slim

RUN apt-get update && apt-get install -y \
    postgresql-client \
    dos2unix \
    unzip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Fix permissions
RUN chmod +x docker-db-restore.sh docker-images-restore.sh && \
    dos2unix ./docker-db-restore.sh && \
    dos2unix ./docker-images-restore.sh && \
    chown -R appuser:appgroup /app

# Create restore directories with ownership
RUN mkdir -p /restore/db /restore/images && \
    chown -R appuser:appgroup /restore

# 🔒 RUN AS NON-ROOT
USER appuser

CMD ["/app/docker-db-restore.sh", "--help"]