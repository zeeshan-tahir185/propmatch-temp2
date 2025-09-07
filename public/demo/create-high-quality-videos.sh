#!/bin/bash

# Create High-Quality Video Versions for Web Streaming
# Optimizes the original 253MB v3.mp4 for different quality levels

set -e

INPUT_VIDEO="v3.mp4"
OUTPUT_PREFIX="v3"

echo "🎬 Creating high-quality video versions..."

# Check if input file exists
if [ ! -f "$INPUT_VIDEO" ]; then
    echo "❌ Input video $INPUT_VIDEO not found!"
    exit 1
fi

echo "📊 Original file size: $(ls -lh $INPUT_VIDEO | awk '{print $5}')"

# 1. Create Ultra-High Quality 4K version (for fast connections)
echo "Creating Ultra-High Quality 4K version..."
ffmpeg -i ${INPUT_VIDEO} -y \
  -c:v libx264 \
  -preset slow \
  -crf 18 \
  -maxrate 15M \
  -bufsize 30M \
  -movflags +faststart \
  -pix_fmt yuv420p \
  -profile:v high \
  -level 5.1 \
  -c:a aac \
  -b:a 256k \
  -ar 48000 \
  ${OUTPUT_PREFIX}-ultra-4k.mp4

# 2. Create High Quality 4K version (balanced)
echo "Creating High Quality 4K version..."
ffmpeg -i ${INPUT_VIDEO} -y \
  -c:v libx264 \
  -preset slow \
  -crf 20 \
  -maxrate 10M \
  -bufsize 20M \
  -movflags +faststart \
  -pix_fmt yuv420p \
  -profile:v high \
  -level 5.1 \
  -c:a aac \
  -b:a 192k \
  -ar 48000 \
  ${OUTPUT_PREFIX}-high-4k.mp4

# 3. Create Standard 4K version (current)
echo "Creating Standard 4K version..."
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
  ${OUTPUT_PREFIX}-4k.mp4

# 4. Create 1080p High Quality
echo "Creating 1080p High Quality version..."
ffmpeg -i ${INPUT_VIDEO} -y \
  -vf "scale=1920:1080" \
  -c:v libx264 \
  -preset slow \
  -crf 20 \
  -maxrate 6M \
  -bufsize 12M \
  -movflags +faststart \
  -pix_fmt yuv420p \
  -profile:v high \
  -level 4.2 \
  -c:a aac \
  -b:a 160k \
  -ar 44100 \
  ${OUTPUT_PREFIX}-1080p-high.mp4

# 5. Create WebM High Quality (for modern browsers)
echo "Creating WebM High Quality version..."
ffmpeg -i ${INPUT_VIDEO} -y \
  -c:v libvpx-vp9 \
  -crf 25 \
  -b:v 0 \
  -cpu-used 2 \
  -row-mt 1 \
  -tile-columns 2 \
  -frame-parallel 1 \
  -c:a libopus \
  -b:a 192k \
  ${OUTPUT_PREFIX}-high.webm

# 6. Create optimized poster image
echo "Creating high-quality poster image..."
ffmpeg -i ${INPUT_VIDEO} -y \
  -vf "select=eq(n\,120),scale=1920:1080" \
  -frames:v 1 \
  -q:v 2 \
  ${OUTPUT_PREFIX}-poster-hq.jpg

# Show file sizes
echo ""
echo "📊 Generated video files:"
ls -lh ${OUTPUT_PREFIX}-*.mp4 ${OUTPUT_PREFIX}-*.webm | grep -v ".sh"

echo ""
echo "✅ High-quality videos created successfully!"
echo ""
echo "🎯 Quality levels:"
echo "  - Ultra 4K: Best quality, large file (~50-80MB)"
echo "  - High 4K: Excellent quality, balanced (~30-50MB)"
echo "  - Standard 4K: Good quality, current (~25-40MB)"
echo "  - 1080p High: Great for most screens (~15-25MB)"
echo "  - WebM: Modern browsers, smaller file (~20-30MB)"
echo ""
echo "📤 Upload to GCS:"
echo "  gsutil -m cp ${OUTPUT_PREFIX}-*.mp4 ${OUTPUT_PREFIX}-*.webm gs://propmatch_frontend/demo/v3/"
echo "  gsutil -m setmeta -h 'Cache-Control:public, max-age=31536000' gs://propmatch_frontend/demo/v3/*.mp4"
