# ---------- Base ----------
FROM python:3.11-slim AS base
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy and set the entrypoint script as the default executable
COPY ./entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]

# ---------- Development Stage ----------
# Build from the base image.
FROM base AS development
COPY . /app/
RUN python manage.py collectstatic --noinput
# Use the Django development server for hot reloading.
CMD ["python", "manage.py", "runserver_plus", "0.0.0.0:8000"]


# ---------- Production Stage ----------
# Build from the base image.
FROM base AS production
COPY . /app/
RUN python manage.py collectstatic --noinput
# Use Gunicorn as the production-ready WSGI server.
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
