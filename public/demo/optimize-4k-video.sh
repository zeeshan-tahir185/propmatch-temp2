#!/bin/bash

# Video Optimization Script for 4K Web Streaming
# Creates multiple quality versions optimized for web delivery

set -e

INPUT_VIDEO="v3.mp4"
OUTPUT_PREFIX="v3"

echo "🎬 Optimizing videos for web streaming..."

# 1. Create 4K version with web optimization (H.264, faststart)
echo "Creating optimized 4K version..."
ffmpeg -i ${INPUT_VIDEO} -y \
  -c:v libx264 \
  -preset slow \
  -crf 23 \
  -maxrate 8M \
  -bufsize 16M \
  -movflags +faststart \
  -pix_fmt yuv420p \
  -profile:v high \
  -level 5.1 \
  -c:a aac \
  -b:a 192k \
  -ar 48000 \
  ${OUTPUT_PREFIX}-4k-optimized.mp4

# 2. Create 1080p version for standard screens
echo "Creating 1080p version..."
ffmpeg -i ${INPUT_VIDEO} -y \
  -vf "scale=1920:1080" \
  -c:v libx264 \
  -preset slow \
  -crf 23 \
  -maxrate 4M \
  -bufsize 8M \
  -movflags +faststart \
  -pix_fmt yuv420p \
  -profile:v high \
  -level 4.2 \
  -c:a aac \
  -b:a 128k \
  -ar 44100 \
  ${OUTPUT_PREFIX}-1080p.mp4

# 3. Create 720p version for mobile/tablets
echo "Creating 720p mobile version..."
ffmpeg -i ${INPUT_VIDEO} -y \
  -vf "scale=1280:720" \
  -c:v libx264 \
  -preset slow \
  -crf 23 \
  -maxrate 2M \
  -bufsize 4M \
  -movflags +faststart \
  -pix_fmt yuv420p \
  -profile:v main \
  -level 3.1 \
  -c:a aac \
  -b:a 96k \
  -ar 44100 \
  ${OUTPUT_PREFIX}-720p.mp4

# 4. Create ultra-light 480p version for slow connections
echo "Creating 480p version..."
ffmpeg -i ${INPUT_VIDEO} -y \
  -vf "scale=854:480" \
  -c:v libx264 \
  -preset slow \
  -crf 25 \
  -maxrate 1M \
  -bufsize 2M \
  -movflags +faststart \
  -pix_fmt yuv420p \
  -profile:v baseline \
  -level 3.0 \
  -c:a aac \
  -b:a 64k \
  -ar 22050 \
  ${OUTPUT_PREFIX}-480p.mp4

# 5. Create WebM version for modern browsers
echo "Creating WebM version..."
ffmpeg -i ${INPUT_VIDEO} -y \
  -c:v libvpx-vp9 \
  -crf 30 \
  -b:v 0 \
  -cpu-used 2 \
  -row-mt 1 \
  -c:a libopus \
  -b:a 128k \
  ${OUTPUT_PREFIX}-optimized.webm

# 6. Generate video thumbnail
echo "Generating thumbnail..."
ffmpeg -i ${INPUT_VIDEO} -y \
  -vf "select=eq(n\,120),scale=1920:1080" \
  -frames:v 1 \
  ${OUTPUT_PREFIX}-poster-hd.jpg

# Show file sizes
echo ""
echo "📊 Optimized video sizes:"
ls -lh ${OUTPUT_PREFIX}*.mp4 ${OUTPUT_PREFIX}*.webm | grep -v ".sh"

echo ""
echo "✅ Video optimization complete!"
echo ""
echo "Upload to GCS:"
echo "  gsutil -m cp ${OUTPUT_PREFIX}-*.mp4 ${OUTPUT_PREFIX}-*.webm gs://propmatch_frontend/demo/v3/"
echo "  gsutil -m setmeta -h 'Cache-Control:public, max-age=31536000' gs://propmatch_frontend/demo/v3/*.mp4"
