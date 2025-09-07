#!/bin/bash

# Deploy Frontend with V6 Video Support
# This script ensures the deployed version uses only v6 videos via signed URLs

set -e

echo "🚀 Deploying PropMatch Frontend with V6 Video Support"
echo "=================================================="

# Check environment variables
echo "📋 Checking environment configuration..."
if [ -z "$PROJECT_ID" ]; then
    echo "❌ PROJECT_ID not set. Please set it: export PROJECT_ID=propmatch-mvp"
    exit 1
fi

# Set deployment variables
SERVICE_NAME="propmatch-frontend-test1"
REGION="us-central1"
API_URL="https://propmatch-backend-1077352833070.us-central1.run.app"
PRODUCTION_API_URL="https://propmatch-backend-1077352833070.us-central1.run.app"
GOOGLE_CLIENT_ID="1077352833070-13hpt2jjmq726b3ka2ln96r387vgqkhd.apps.googleusercontent.com"
VIDEO_PROXY_URL="https://propmatch-video-proxy-giwo4q735a-uc.a.run.app"
USE_GCS_VIDEOS="true"

echo "🔧 Configuration:"
echo "   Project: $PROJECT_ID"
echo "   Service: $SERVICE_NAME"
echo "   Region: $REGION"
echo "   API URL: $API_URL"
echo "   GCS Videos: $USE_GCS_VIDEOS"

# Verify backend is accessible
echo "🔍 Verifying backend API accessibility..."
if curl -s --head "$API_URL/health" | head -n 1 | grep -q "200 OK"; then
    echo "✅ Backend API is accessible"
else
    echo "⚠️  Warning: Backend API may not be accessible. Continuing with deployment..."
fi

# Check if signed URL endpoint works
echo "🎥 Checking v6 video signed URL endpoint..."
if curl -s "$API_URL/video/signed-url?video_version=v6" | grep -q "signed_url"; then
    echo "✅ V6 video signed URL endpoint is working"
else
    echo "⚠️  Warning: V6 video signed URL endpoint may not be working. Check backend deployment."
fi

# Build and deploy
echo "🔨 Starting Cloud Build deployment..."
gcloud builds submit \
    --config=deploy/cloudbuild.yaml \
    --substitutions="\
_SERVICE_NAME=$SERVICE_NAME,\
_REGION=$REGION,\
_API_URL=$API_URL,\
_PRODUCTION_API_URL=$PRODUCTION_API_URL,\
_GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID,\
_VIDEO_PROXY_URL=$VIDEO_PROXY_URL,\
_USE_GCS_VIDEOS=$USE_GCS_VIDEOS" \
    .

echo "✅ Deployment completed!"

# Get service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')
echo "🌐 Service URL: $SERVICE_URL"

# Verify deployment
echo "🔍 Verifying deployment..."
if curl -s --head "$SERVICE_URL" | head -n 1 | grep -q "200 OK"; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend may not be accessible"
fi

echo ""
echo "🎯 V6 Video Deployment Summary:"
echo "================================"
echo "✅ Removed all v3 video fallbacks"
echo "✅ Only uses v6 videos via signed URLs"
echo "✅ Optimized for streaming performance"
echo "✅ Environment variables configured"
echo ""
echo "🔧 To verify v6 video loading:"
echo "1. Open: $SERVICE_URL"
echo "2. Check browser console for v6 video logs"
echo "3. Verify no 404 errors for missing videos"
echo "4. Confirm video shows 'PropMatch Demo v6' in loading state"
echo ""
echo "🚨 If v3 videos still appear:"
echo "1. Clear browser cache"
echo "2. Check environment variables in Cloud Run console"
echo "3. Verify backend /video/signed-url endpoint"
