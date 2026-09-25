# ===================================================
# Stage 1: Build React Frontend (Vite)
# ===================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all frontend files (now in root) and build
COPY . .
RUN npm run build

# ===================================================
# Stage 2: Python Backend with Gunicorn
# ===================================================
FROM python:3.11-slim
WORKDIR /app

# Prevent Python from writing .pyc and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install Python requirements (now inside api/)
COPY api/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application, model and scaler
COPY api/ ./api/
COPY model.pkl ./model.pkl
COPY bank-full.csv ./bank-full.csv

# Copy compiled frontend build from Stage 1
COPY --from=frontend-builder /app/dist ./dist

# Expose default port
EXPOSE 5000
ENV PORT=5000

# Start production WSGI server
CMD ["gunicorn", "api.index:app", "--bind", "0.0.0.0:5000", "--workers", "2", "--threads", "4", "--timeout", "120"]
