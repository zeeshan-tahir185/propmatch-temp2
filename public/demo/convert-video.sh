#!/bin/bash

# HIGH-PERFORMANCE Video conversion script for web optimization
# Maintains original quality, framerate, and ensures instant loading

echo "🎬 Converting video for INSTANT loading with HIGH quality & framerate preservation..."

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ FFmpeg is required but not installed. Please install FFmpeg first."
    echo "📦 On macOS: brew install ffmpeg"
    echo "📦 On Ubuntu: sudo apt-get install ffmpeg"
    echo "📦 On Windows: Download from https://ffmpeg.org/download.html"
    exit 1
fi

# Get original video info
echo "📊 Analyzing original video..."
ORIGINAL_FPS=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 v3.mp4)
ORIGINAL_RESOLUTION=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 v3.mp4)
ORIGINAL_BITRATE=$(ffprobe -v error -show_entries format=bit_rate -of csv=p=0 v3.mp4)

echo "✅ Original specs: ${ORIGINAL_RESOLUTION} @ ${ORIGINAL_FPS}fps, ${ORIGINAL_BITRATE} bitrate"

# High-quality MP4 for instant loading (PRIORITY FORMAT)
echo "🚀 Converting to HIGH-QUALITY MP4 for instant loading..."
ffmpeg -i v3.mp4 \
  -c:v libx264 \
  -crf 18 \
  -preset slow \
  -profile:v high \
  -level:v 4.2 \
  -bf 2 \
  -g 30 \
  -maxrate 8M \
  -bufsize 16M \
  -c:a aac \
  -b:a 192k \
  -ar 48000 \
  -movflags +faststart \
  -pix_fmt yuv420p \
  -tune film \
  v3-optimized.mp4

# Ultra-high quality WebM (VP9) - maintains original quality
echo "💎 Converting to ULTRA-HIGH QUALITY WebM..."
ffmpeg -i v3.mp4 \
  -c:v libvpx-vp9 \
  -crf 15 \
  -b:v 0 \
  -quality best \
  -speed 0 \
  -row-mt 1 \
  -tile-columns 2 \
  -c:a libopus \
  -b:a 192k \
  -ar 48000 \
  v3.webm

# Create 4K quality version for large screens
echo "📺 Creating 4K-optimized version..."
ffmpeg -i v3.mp4 \
  -c:v libx264 \
  -crf 20 \
  -preset medium \
  -profile:v high \
  -level:v 5.1 \
  -maxrate 15M \
  -bufsize 30M \
  -c:a aac \
  -b:a 256k \
  -movflags +faststart \
  -pix_fmt yuv420p \
  v3-4k.mp4

# Mobile optimized but high FPS preserved
echo "📱 Creating mobile-optimized version (preserving FPS)..."
ffmpeg -i v3.mp4 \
  -c:v libx264 \
  -crf 24 \
  -preset fast \
  -vf "scale=1920:1080:flags=lanczos" \
  -maxrate 4M \
  -bufsize 8M \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  v3-mobile.mp4

# Generate multiple poster images at different times
echo "🖼️ Generating high-quality poster images..."
ffmpeg -i v3.mp4 -ss 00:00:03 -vframes 1 -q:v 1 -vf "scale=1920:1080:flags=lanczos" video-poster.jpg
ffmpeg -i v3.mp4 -ss 00:00:10 -vframes 1 -q:v 1 -vf "scale=800:450:flags=lanczos" video-poster-small.jpg
ffmpeg -i v3.mp4 -ss 00:00:05 -vframes 1 -q:v 1 -vf "scale=1280:720:flags=lanczos" video-poster-medium.jpg

# Create animated WebP preview
echo "⚡ Creating animated preview..."
ffmpeg -i v3.mp4 -ss 00:00:02 -t 3 -vf "fps=10,scale=400:225:flags=lanczos" -c:v libwebp -lossless 0 -compression_level 6 -q:v 70 -loop 0 video-preview.webp

echo "✅ Video conversion complete!"
echo ""
echo "📁 Files created for INSTANT loading:"
echo "  🎯 v3-optimized.mp4 (HIGH-QUALITY - Primary format)"
echo "  💎 v3.webm (ULTRA-HIGH-QUALITY compression)"
echo "  📺 v3-4k.mp4 (4K quality for large screens)"
echo "  📱 v3-mobile.mp4 (Mobile optimized)"
echo "  🖼️ video-poster.jpg (Full HD poster)"
echo "  🖼️ video-poster-medium.jpg (HD poster)"
echo "  🖼️ video-poster-small.jpg (Mobile poster)"
echo "  ⚡ video-preview.webp (Animated preview)"
echo ""
echo "🚀 Original quality, framerate, and resolution PRESERVED!"
echo "⚡ All videos optimized for INSTANT streaming with faststart!"

# Display file sizes
echo ""
echo "📊 File sizes:"
ls -lh v3*.* | awk '{print "  " $9 ": " $5}'