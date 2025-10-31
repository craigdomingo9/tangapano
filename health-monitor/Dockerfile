# Use an official lightweight Python image
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file first to leverage Docker's build cache
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all the application source code
COPY . .

# Command to run when the container starts
# We use -u for unbuffered Python output, which helps with logging
CMD [ "python", "-u", "main.py" ]
