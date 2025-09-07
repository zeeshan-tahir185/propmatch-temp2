#!/bin/bash

# PropMatch Frontend Deployment to Different Endpoint
# Easy configuration for deploying to different regions/services

set -e

echo "🚀 Deploying PropMatch Frontend to Different Endpoint..."

# ========================================
# EASY CONFIGURATION - CHANGE THESE VALUES
# ========================================
PROJECT_ID=${PROJECT_ID:-"propmatch-mvp"}        # Your GCP Project ID
REGION=${REGION:-"us-east1"}                     # Different region (us-east1, europe-west1, asia-southeast1)
SERVICE_NAME=${SERVICE_NAME:-"propmatch-frontend-staging"}  # Different service name
VIDEO_PROXY_URL=${VIDEO_PROXY_URL:-"https://propmatch-video-proxy-giwo4q735a-uc.a.run.app"}  # Video proxy URL
# ========================================

echo "📋 Configuration:"
echo "  Project ID: ${PROJECT_ID}"
echo "  Region: ${REGION}"
echo "  Service Name: ${SERVICE_NAME}"
echo "  Video Proxy: ${VIDEO_PROXY_URL}"

# Build and deploy using Cloud Build
echo "📦 Building and deploying..."
gcloud builds submit \
  --config deploy/cloudbuild.yaml \
  --project ${PROJECT_ID} \
  --substitutions \
    _SERVICE_NAME=${SERVICE_NAME},\
    _REGION=${REGION},\
    _VIDEO_PROXY_URL=${VIDEO_PROXY_URL}

# Get the service URL
echo "🔍 Getting service URL..."
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} \
  --region=${REGION} \
  --project=${PROJECT_ID} \
  --format='value(status.url)')

echo ""
echo "✅ Frontend deployed successfully!"
echo "📍 Service URL: ${SERVICE_URL}"
echo ""
echo "🎬 Video proxy URL: ${VIDEO_PROXY_URL}"
echo ""
echo "To test:"
echo "  curl ${SERVICE_URL}"
echo "  curl ${VIDEO_PROXY_URL}/health"
