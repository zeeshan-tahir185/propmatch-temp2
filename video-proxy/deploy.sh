#!/bin/bash

# PropMatch Video Proxy Deployment Script
# Deploys the video proxy service to Cloud Run with optimized settings

set -e

echo "🎬 Deploying PropMatch Video Proxy Service..."

# Configuration
PROJECT_ID=${PROJECT_ID:-"propmatch-mvp"}
REGION=${REGION:-"us-central1"}
SERVICE_NAME="propmatch-video-proxy"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

# Build and push using Cloud Build
echo "📦 Building container with Cloud Build..."
gcloud builds submit \
  --config cloudbuild.yaml \
  --project ${PROJECT_ID} \
  --substitutions SHORT_SHA=$(git rev-parse --short HEAD) \
  .

# Get the service URL
echo "🔍 Getting service URL..."
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} \
  --region=${REGION} \
  --project=${PROJECT_ID} \
  --format='value(status.url)')

echo "✅ Video proxy deployed successfully!"
echo "📍 Service URL: ${SERVICE_URL}"
echo ""
echo "To test the service:"
echo "  curl ${SERVICE_URL}/health"
echo "  curl -H 'Range: bytes=0-1048576' ${SERVICE_URL}/v3-4k.mp4"
