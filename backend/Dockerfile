# ---------- Base ----------
FROM python:3.11-slim AS base
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    dos2unix \
    libpango-1.0-0 \
    libpangoft2-1.0-0 \
    libharfbuzz-subset0 \
    netcat-openbsd \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# ---------- Development Stage ----------
FROM base AS development
COPY . /app/
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["python", "manage.py", "runserver_plus", "0.0.0.0:8000", "--reloader-type", "stat"]

# ---------- Production Stage (Hardened) ----------
FROM base AS production

# Create a dedicated non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

COPY . /app/

# Fix permissions
RUN chmod +x /app/entrypoint.sh && \
    chown -R appuser:appgroup /app

# 🔒 RUN AS NON-ROOT
USER appuser

ENTRYPOINT ["/app/entrypoint.sh"]

# Optimized Gunicorn command
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "5", "--timeout", "120", "--worker-class", "gthread", "--threads", "4", "config.wsgi:application"]