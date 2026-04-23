# Use official Python runtime
FROM python:3.10-slim

# Install system dependencies (FFmpeg for audio processing)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Create and set working directory IN THE CONTAINER
WORKDIR /app

# Set environment variables
ENV ENVIRONMENT=production
ENV PYTHONPATH=/app

# Copy requirements.txt from local to container
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy ALL other files from local to container
COPY . .

# Expose port 7860
EXPOSE 7860

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]