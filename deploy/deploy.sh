#!/bin/bash

# PropMatch Frontend Deployment Script
# This script builds and deploys the frontend to Google Cloud Run

set -e  # Exit on any error

# Load configuration from .env file
ENV_FILE="$(dirname "$0")/../.env"
if [ -f "$ENV_FILE" ]; then
    # Export variables from .env (ignore comments and empty lines)
    export $(grep -v '^#' "$ENV_FILE" | grep -v '^\s*$' | xargs)
else
    echo "❌ Error: .env file not found at $ENV_FILE"
    exit 1
fi

# Configuration from .env
PROJECT_ID="${PROJECT_ID:?PROJECT_ID not set in .env}"
SERVICE_NAME="${SERVICE_NAME:?SERVICE_NAME not set in .env}"
REGION="${REGION:?REGION not set in .env}"

echo "🚀 Starting PropMatch Frontend Deployment..."

# Check if gcloud is authenticated
if ! gcloud auth list --filter="status:ACTIVE" --format="value(account)" | grep -q "@"; then
    echo "❌ Error: Not authenticated with gcloud. Please run 'gcloud auth login'"
    exit 1
fi

# Set the project
echo "📋 Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Check if environment variables are set
if [ -z "$NEXT_PUBLIC_GOOGLE_CLIENT_ID" ]; then
    echo "⚠️  Warning: NEXT_PUBLIC_GOOGLE_CLIENT_ID not set in environment"
    echo "Using default from .env file..."
    export NEXT_PUBLIC_GOOGLE_CLIENT_ID="1077352833070-13hpt2jjmq726b3ka2ln96r387vgqkhd.apps.googleusercontent.com"
fi

echo "🔧 Environment variables:"
echo "  - NEXT_PUBLIC_API_URL=https://propmatch-backend-1077352833070.us-central1.run.app"
echo "  - NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID"

# Navigate to frontend directory
cd "$(dirname "$0")/.."

# Build and deploy using Cloud Build
echo "🏗️  Building and deploying with Cloud Build..."
gcloud builds submit \
    --config deploy/cloudbuild.yaml \
    --substitutions _SERVICE_NAME=$SERVICE_NAME,_REGION=$REGION \
    .

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")

echo "✅ Deployment completed successfully!"
echo "🌐 Service URL: $SERVICE_URL"
echo ""
echo "📝 Next steps:"
echo "1. Verify Google OAuth authorized origins include: $SERVICE_URL"
echo "2. Test Google Sign-In functionality"
echo "3. Check browser console for any client ID validation errors"