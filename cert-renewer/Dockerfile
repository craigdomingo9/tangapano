FROM python:3.10-slim

# Install certbot
RUN apt-get update && apt-get install -y certbot && apt-get clean

WORKDIR /app

# Create non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Fix permissions so appuser can execute scripts
RUN chmod +x /app/entrypoint.sh && \
    chown -R appuser:appgroup /app

# Ensure appuser can write to Certbot logs/config
# (We might need to mount these as allowing write in docker-compose)
RUN mkdir -p /var/log/letsencrypt /var/lib/letsencrypt /etc/letsencrypt && \
    chown -R appuser:appgroup /var/log/letsencrypt /var/lib/letsencrypt /etc/letsencrypt

# 🔒 RUN AS NON-ROOT
USER appuser

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["python", "main.py"]