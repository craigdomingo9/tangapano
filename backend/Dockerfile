# ---------- Base ----------
FROM python:3.11-slim AS base
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy entrypoint
COPY ./entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# ---------- Development ----------
FROM base AS development
COPY . /app/
CMD ["/app/entrypoint.sh", "python", "manage.py", "runserver", "0.0.0.0:8000"]

# ---------- Production ----------
FROM base AS production
COPY . /app/
RUN python manage.py collectstatic --noinput
CMD ["/app/entrypoint.sh", "gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
