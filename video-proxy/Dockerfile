FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY app.py .

# Use gunicorn with optimized settings for video streaming
CMD exec gunicorn --bind :$PORT \
    --workers 4 \
    --threads 4 \
    --worker-class gthread \
    --timeout 60 \
    --keep-alive 5 \
    --max-requests 1000 \
    --max-requests-jitter 50 \
    --access-logfile - \
    --error-logfile - \
    app:app