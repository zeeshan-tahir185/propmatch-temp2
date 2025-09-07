#!/bin/bash

# Setup Cloud CDN for Video Streaming
# This script configures Cloud CDN with a load balancer for optimal video delivery

set -e

PROJECT_ID=${PROJECT_ID:-"propmatch-ai"}
REGION="us-central1"
SERVICE_NAME="propmatch-video-proxy"

echo "🌐 Setting up Cloud CDN for video streaming..."

# 1. Create a backend service for the Cloud Run service
echo "Creating backend service..."
gcloud compute backend-services create ${SERVICE_NAME}-backend \
  --global \
  --load-balancing-scheme=EXTERNAL \
  --protocol=HTTPS \
  --project=${PROJECT_ID} || echo "Backend service already exists"

# 2. Create a NEG (Network Endpoint Group) for Cloud Run
echo "Creating serverless NEG..."
gcloud compute network-endpoint-groups create ${SERVICE_NAME}-neg \
  --region=${REGION} \
  --network-endpoint-type=serverless \
  --cloud-run-service=${SERVICE_NAME} \
  --project=${PROJECT_ID} || echo "NEG already exists"

# 3. Add the NEG to the backend service
echo "Adding NEG to backend service..."
gcloud compute backend-services add-backend ${SERVICE_NAME}-backend \
  --global \
  --network-endpoint-group=${SERVICE_NAME}-neg \
  --network-endpoint-group-region=${REGION} \
  --project=${PROJECT_ID} || echo "Backend already added"

# 4. Enable Cloud CDN on the backend service
echo "Enabling Cloud CDN..."
gcloud compute backend-services update ${SERVICE_NAME}-backend \
  --global \
  --enable-cdn \
  --cache-mode=CACHE_ALL_STATIC \
  --default-ttl=3600 \
  --max-ttl=86400 \
  --client-ttl=3600 \
  --negative-caching \
  --serve-while-stale=86400 \
  --project=${PROJECT_ID}

# 5. Create URL map
echo "Creating URL map..."
gcloud compute url-maps create ${SERVICE_NAME}-url-map \
  --default-service=${SERVICE_NAME}-backend \
  --project=${PROJECT_ID} || echo "URL map already exists"

# 6. Create HTTPS proxy
echo "Creating HTTPS proxy..."
gcloud compute target-https-proxies create ${SERVICE_NAME}-https-proxy \
  --url-map=${SERVICE_NAME}-url-map \
  --ssl-certificates=propmatch-ssl-cert \
  --project=${PROJECT_ID} || echo "HTTPS proxy already exists"

# 7. Create forwarding rule
echo "Creating forwarding rule..."
gcloud compute forwarding-rules create ${SERVICE_NAME}-forwarding-rule \
  --global \
  --target-https-proxy=${SERVICE_NAME}-https-proxy \
  --ports=443 \
  --project=${PROJECT_ID} || echo "Forwarding rule already exists"

# 8. Get the load balancer IP
echo "Getting load balancer IP..."
LB_IP=$(gcloud compute forwarding-rules describe ${SERVICE_NAME}-forwarding-rule \
  --global \
  --project=${PROJECT_ID} \
  --format='value(IPAddress)')

echo ""
echo "✅ Cloud CDN setup complete!"
echo "📍 Load Balancer IP: ${LB_IP}"
echo ""
echo "Next steps:"
echo "1. Update DNS to point video.propmatch.ai to ${LB_IP}"
echo "2. Update frontend to use: https://video.propmatch.ai/"
echo ""
echo "To test CDN caching:"
echo "  curl -I https://video.propmatch.ai/health"
echo "  curl -I https://video.propmatch.ai/v3-4k.mp4"
