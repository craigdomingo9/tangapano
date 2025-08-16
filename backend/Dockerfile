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

# ---------- Development ----------
FROM base AS development
COPY . /app/
# Use runserver_plus for hot reloading in development
CMD ["python", "manage.py", "runserver_plus", "0.0.0.0:8000"]

# ---------- Production ----------
FROM base AS production
COPY . /app/
RUN python manage.py collectstatic --noinput


CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]

