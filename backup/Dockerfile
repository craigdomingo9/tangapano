FROM python:3.9-slim

RUN apt-get update && apt-get install -y \
    postgresql-client \
    dos2unix \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

# Fix permissions
RUN dos2unix ./entrypoint.sh && \
    chmod +x ./entrypoint.sh && \
    chown -R appuser:appgroup /app

# Create backup directories with correct ownership
RUN mkdir -p /app/backups/db /app/backups/images && \
    chown -R appuser:appgroup /app/backups

# 🔒 RUN AS NON-ROOT
USER appuser

CMD ["./entrypoint.sh"]