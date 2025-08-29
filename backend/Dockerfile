# ---------- Base ----------
FROM python:3.11-slim AS base
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install dos2unix to handle line endings
RUN apt-get update && apt-get install -y dos2unix && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/

# Install dos2unix to handle line endings
RUN apt-get update && apt-get install -y dos2unix && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy and set the entrypoint script as the default executable
COPY ./entrypoint.sh /app/entrypoint.sh
RUN dos2unix /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]

# ---------- Development Stage ----------
# Build from the base image.
FROM base AS development
COPY . /app/

RUN python manage.py collectstatic --noinput

ENTRYPOINT ["sh", "-c", "chmod +x /app/entrypoint.sh && /app/entrypoint.sh"]
# Use the Django development server for hot reloading.
CMD ["python", "manage.py", "runserver_plus", "0.0.0.0:8000"]


# ---------- Production Stage ----------
# Build from the base image.
FROM base AS production
COPY . /app/

RUN python manage.py collectstatic --noinput

ENTRYPOINT ["sh", "-c", "chmod +x /app/entrypoint.sh && /app/entrypoint.sh"]
# Use Gunicorn as the production-ready WSGI server.
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
