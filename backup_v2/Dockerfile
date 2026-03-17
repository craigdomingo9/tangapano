FROM python:3.10-alpine

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apk add --no-cache postgresql17-client && \
    apk add --no-cache rclone

WORKDIR /app

# Create a non-root user and group
# -D: Don't assign a password
# -g: Add to group with same name
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY ./requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

# Permission Handoff
# Transfer ownership of the /app directory to our new user
RUN chown -R appuser:appgroup /app

# Switch User
# All subsequent commands (CMD, RUN) will run as this user
USER appuser

CMD ["python", "main.py"]