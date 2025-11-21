# ---------- Base ----------
FROM python:3.11-slim AS base
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    dos2unix \
    netcat-openbsd \
    nano \
    curl \
    net-tools \
    iproute2 \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt


# ---------- Development Stage ----------
FROM base AS development
COPY . /app/

# FIX: Point directly to the script
ENTRYPOINT ["/app/entrypoint.sh"]

# FIX: Standard CMD array
CMD ["python", "manage.py", "runserver_plus", "0.0.0.0:8000", "--reloader-type", "stat"]

# ---------- Production Stage ----------
FROM base AS production
COPY . /app/

# FIX: Point directly to the script
ENTRYPOINT ["/app/entrypoint.sh"]

# FIX: Standard CMD array
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "5", "--timeout", "120", "--worker-class", "gthread", "--threads", "4", "config.wsgi:application"]