# ---------- Base ----------
FROM python:3.11-slim AS base
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt /app/

# Install dos2unix to handle line endings
RUN apt-get update && apt-get install -y \
    dos2unix \
    net-tools \
    iproute2 \
    && rm -rf /var/lib/apt/lists/*
    
# Install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entrypoint script
COPY ./entrypoint.sh /app/entrypoint.sh

# ---------- Development Stage ----------
# Build from the base image.
FROM base AS development
COPY . /app/

RUN python manage.py collectstatic --noinput

# Make the entrypoint script executable
# ENTRYPOINT ["sh", "-c", "dos2unix /app/entrypoint.sh && /app/entrypoint.sh"]

# Use the Django development server for hot reloading.
CMD ["python", "manage.py", "runserver_plus", "0.0.0.0:8000"]


# ---------- Production Stage ----------
# Build from the base image.
FROM base AS production
COPY . /app/

RUN python manage.py collectstatic --noinput

# Make the entrypoint script executable
# ENTRYPOINT ["sh", "-c", "dos2unix /app/entrypoint.sh && /app/entrypoint.sh"]

# Use Gunicorn as the production-ready WSGI server.
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "9", "--timeout", "120", "--worker-class", "gthread", "--threads", "4", "--max-requests", "1000", "--max-requests-jitter", "100", "--preload", "config.wsgi:application"]
