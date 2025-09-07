#!/bin/bash

# Configure GCS Bucket for Optimal Video Streaming
# Sets up caching, lifecycle, and metadata for video files

set -e

BUCKET_NAME="propmatch_frontend"
VIDEO_PREFIX="demo/v3"

echo "🪣 Configuring GCS bucket for video streaming..."

# 1. Update CORS configuration for video streaming
echo "Setting CORS configuration..."
cat > /tmp/cors.json <<EOF
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD", "OPTIONS"],
    "responseHeader": ["Content-Type", "Content-Length", "Accept-Ranges", "Content-Range", "Cache-Control", "ETag", "Last-Modified"],
    "maxAgeSeconds": 3600
  }
]
EOF

gsutil cors set /tmp/cors.json gs://${BUCKET_NAME}

# 2. Set cache control headers on video files
echo "Setting cache control headers on videos..."
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000, immutable" \
  -h "Content-Disposition:inline" \
  "gs://${BUCKET_NAME}/${VIDEO_PREFIX}/*.mp4"

gsutil -m setmeta -h "Cache-Control:public, max-age=31536000, immutable" \
  -h "Content-Disposition:inline" \
  "gs://${BUCKET_NAME}/${VIDEO_PREFIX}/*.webm" 2>/dev/null || true

# 3. Set proper content types
echo "Setting content types..."
gsutil -m setmeta -h "Content-Type:video/mp4" \
  "gs://${BUCKET_NAME}/${VIDEO_PREFIX}/*.mp4"

gsutil -m setmeta -h "Content-Type:video/webm" \
  "gs://${BUCKET_NAME}/${VIDEO_PREFIX}/*.webm" 2>/dev/null || true

# 4. Enable uniform bucket-level access (recommended for CDN)
echo "Configuring bucket access..."
gsutil uniformbucketlevelaccess set on gs://${BUCKET_NAME}

# 5. Set bucket to be publicly readable (for CDN access)
echo "Setting public access for videos..."
gsutil -m acl ch -u AllUsers:R "gs://${BUCKET_NAME}/${VIDEO_PREFIX}/*"

# 6. Create lifecycle rule to delete old video versions
echo "Setting lifecycle rules..."
cat > /tmp/lifecycle.json <<EOF
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "Delete"},
        "condition": {
          "age": 90,
          "matchesPrefix": ["demo/old/"]
        }
      }
    ]
  }
}
EOF

gsutil lifecycle set /tmp/lifecycle.json gs://${BUCKET_NAME}

# 7. Enable versioning for safety
echo "Enabling versioning..."
gsutil versioning set on gs://${BUCKET_NAME}

# 8. Set up monitoring alert for high bandwidth usage
echo "Note: Set up budget alerts in GCP Console to monitor bandwidth costs"

# Clean up temp files
rm /tmp/cors.json /tmp/lifecycle.json

echo ""
echo "✅ GCS bucket configured for video streaming!"
echo ""
echo "Bucket settings:"
echo "  - CORS enabled for all origins"
echo "  - Cache headers set (1 year)"
echo "  - Public read access for videos"
echo "  - Versioning enabled"
echo ""
echo "To upload optimized videos:"
echo "  gsutil -m cp -r ./v3*.mp4 ./v3*.webm gs://${BUCKET_NAME}/${VIDEO_PREFIX}/"
