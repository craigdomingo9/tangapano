# ---------- Base ----------
FROM python:3.11-slim AS base
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# ---------- Development ----------
FROM base AS development
COPY . /app/
RUN python manage.py migrate
RUN python manage.py seed_campuses
RUN python manage.py seed_data
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# ---------- Production ----------
FROM base AS production
COPY . /app/
RUN python manage.py migrate
RUN python manage.py seed_production_data
RUN python manage.py collectstatic --noinput
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
