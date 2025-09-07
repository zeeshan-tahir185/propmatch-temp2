#!/bin/bash

# PropMatch Frontend Deployment with Environment Variables
# Reads from env file and deploys to different endpoints

set -e

echo "🚀 Deploying PropMatch Frontend with Environment Variables..."

# Load environment variables from env file
if [ -f "env" ]; then
    echo "📖 Loading environment variables from env file..."
    export $(grep -v '^#' env | xargs)
else
    echo "❌ env file not found. Please create one based on the template."
    exit 1
fi

# # Set default values if not in env file
# SERVICE_NAME=${SERVICE_NAME:-"propmatch-frontend"}
# REGION=${REGION:-"us-central1"}
# PROJECT_ID=${PROJECT_ID:-"propmatch-mvp"}

# Video proxy URL (use existing one or create new)
VIDEO_PROXY_URL=${NEXT_PUBLIC_VIDEO_PROXY_URL:-"https://propmatch-video-proxy-giwo4q735a-uc.a.run.app"}

echo "📋 Configuration from env file:"
echo "  Project ID: ${PROJECT_ID}"
echo "  Region: ${REGION}"
echo "  Service Name: ${SERVICE_NAME}"
echo "  API URL: ${NEXT_PUBLIC_API_URL}"
echo "  Video Proxy: ${VIDEO_PROXY_URL}"
echo "  Use GCS Videos: ${NEXT_PUBLIC_USE_GCS_VIDEOS}"

# Confirm deployment
read -p "🤔 Deploy to ${SERVICE_NAME} in ${REGION}? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled."
    exit 1
fi

# Build and deploy using Cloud Build
echo "📦 Building and deploying..."
gcloud builds submit \
  --config deploy/cloudbuild.yaml \
  --project ${PROJECT_ID} \
  --substitutions _SERVICE_NAME=${SERVICE_NAME},_REGION=${REGION},_API_URL=${NEXT_PUBLIC_API_URL},_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID},_VIDEO_PROXY_URL=${VIDEO_PROXY_URL},_USE_GCS_VIDEOS=${NEXT_PUBLIC_USE_GCS_VIDEOS}

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
echo "🌐 Open in browser: ${SERVICE_URL}"
echo ""
echo "To test video proxy:"
echo "  curl ${VIDEO_PROXY_URL}/health"
