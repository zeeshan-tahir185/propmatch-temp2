#!/bin/bash

# PropMatch Video Update Script
# This script processes a new video and uploads it to GCS with proper optimization

set -e  # Exit on any error

# Configuration
BUCKET="propmatch_frontend"
CURRENT_VERSION="v3"
NEW_VERSION=""
SOURCE_VIDEO=""
GCS_PATH="demo"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Help function
show_help() {
    echo "PropMatch Video Update Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -v, --version VERSION     New version name (e.g., v4, v5)"
    echo "  -f, --file FILE          Path to new video file"
    echo "  -h, --help               Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --version v4 --file new-demo.mp4"
    echo "  $0 -v v4 -f ~/Desktop/updated-demo.mov"
    echo ""
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -v|--version)
            NEW_VERSION="$2"
            shift 2
            ;;
        -f|--file)
            SOURCE_VIDEO="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# Validate inputs
if [ -z "$NEW_VERSION" ]; then
    echo -e "${RED}Error: Version is required${NC}"
    show_help
    exit 1
fi

if [ -z "$SOURCE_VIDEO" ]; then
    echo -e "${RED}Error: Source video file is required${NC}"
    show_help
    exit 1
fi

if [ ! -f "$SOURCE_VIDEO" ]; then
    echo -e "${RED}Error: Source video file does not exist: $SOURCE_VIDEO${NC}"
    exit 1
fi

# Check if required tools are installed
check_dependencies() {
    echo -e "${BLUE}Checking dependencies...${NC}"
    
    if ! command -v ffmpeg &> /dev/null; then
        echo -e "${RED}Error: FFmpeg is required but not installed${NC}"
        echo "Install with: brew install ffmpeg"
        exit 1
    fi
    
    if ! command -v gsutil &> /dev/null; then
        echo -e "${RED}Error: Google Cloud SDK (gsutil) is required but not installed${NC}"
        echo "Install from: https://cloud.google.com/sdk/docs/install"
        exit 1
    fi
    
    echo -e "${GREEN}✓ All dependencies found${NC}"
}

# Create optimized video versions
optimize_video() {
    echo -e "${BLUE}Creating optimized video versions for $NEW_VERSION...${NC}"
    
    local source_file="$1"
    local base_name="$NEW_VERSION"
    
    # Get video info
    echo "📊 Analyzing source video..."
    local fps=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 "$source_file")
    local resolution=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$source_file")
    echo "✅ Source specs: ${resolution} @ ${fps}fps"
    
    # High-quality web-optimized MP4
    echo "🚀 Creating optimized MP4..."
    ffmpeg -i "$source_file" \
        -c:v libx264 -crf 18 -preset slow -profile:v high -level:v 4.2 \
        -bf 2 -g 30 -maxrate 8M -bufsize 16M \
        -c:a aac -b:a 192k -ar 48000 \
        -movflags +faststart -pix_fmt yuv420p -tune film \
        "${base_name}-optimized.mp4" -y
    
    # Ultra-compressed WebM
    echo "💎 Creating WebM version..."
    ffmpeg -i "$source_file" \
        -c:v libvpx-vp9 -crf 15 -b:v 0 -quality best -speed 0 \
        -row-mt 1 -tile-columns 2 \
        -c:a libopus -b:a 192k -ar 48000 \
        "${base_name}.webm" -y
    
    # 4K quality version
    echo "📺 Creating 4K version..."
    ffmpeg -i "$source_file" \
        -c:v libx264 -crf 20 -preset medium -profile:v high -level:v 5.1 \
        -maxrate 15M -bufsize 30M \
        -c:a aac -b:a 256k -movflags +faststart -pix_fmt yuv420p \
        "${base_name}-4k.mp4" -y
    
    # Mobile optimized
    echo "📱 Creating mobile version..."
    ffmpeg -i "$source_file" \
        -c:v libx264 -crf 24 -preset fast \
        -vf "scale=1920:1080:flags=lanczos" \
        -maxrate 4M -bufsize 8M \
        -c:a aac -b:a 128k -movflags +faststart \
        "${base_name}-mobile.mp4" -y
    
    # Small fallback version
    echo "🔄 Creating small fallback..."
    ffmpeg -i "$source_file" \
        -vf "scale=960:540" -crf 28 -preset fast \
        -movflags +faststart -t 30 \
        "${base_name}-small.mp4" -y
    
    # Copy original with proper naming
    echo "📄 Copying original..."
    cp "$source_file" "${base_name}.mp4"
    
    # Generate poster images
    echo "🖼️ Creating poster images..."
    ffmpeg -i "$source_file" -ss 00:00:03 -vframes 1 -q:v 1 \
        -vf "scale=1920:1080:flags=lanczos" video-poster.jpg -y
    ffmpeg -i "$source_file" -ss 00:00:05 -vframes 1 -q:v 1 \
        -vf "scale=1280:720:flags=lanczos" video-poster-medium.jpg -y
    ffmpeg -i "$source_file" -ss 00:00:10 -vframes 1 -q:v 1 \
        -vf "scale=800:450:flags=lanczos" video-poster-small.jpg -y
    
    # Create animated preview
    echo "⚡ Creating animated preview..."
    ffmpeg -i "$source_file" -ss 00:00:02 -t 3 \
        -vf "fps=10,scale=400:225:flags=lanczos" \
        -c:v libwebp -lossless 0 -compression_level 6 -q:v 70 -loop 0 \
        video-preview.webp -y
    
    echo -e "${GREEN}✅ All video versions created successfully!${NC}"
}

# Upload to GCS
upload_to_gcs() {
    echo -e "${BLUE}Uploading videos to GCS...${NC}"
    
    local version="$1"
    local gcs_folder="gs://${BUCKET}/${GCS_PATH}/${version}/"
    
    # Create the folder and set permissions
    gsutil -m cp -r ${version}* "${gcs_folder}"
    gsutil -m cp video-poster* "${gcs_folder}"
    gsutil -m cp video-preview.webp "${gcs_folder}"
    
    # Make files publicly accessible
    echo "🌐 Setting public access..."
    gsutil -m acl ch -u AllUsers:R "${gcs_folder}*"
    
    # Set cache headers for better performance
    echo "⚡ Setting cache headers..."
    gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" "${gcs_folder}*"
    
    echo -e "${GREEN}✅ Upload complete!${NC}"
    echo -e "${YELLOW}Videos available at: https://storage.googleapis.com/${BUCKET}/${GCS_PATH}/${version}/${NC}"
}

# Update configuration file
update_config() {
    echo -e "${BLUE}Updating video configuration...${NC}"
    
    local config_file="../../../src/config/videoConfig.js"
    if [ -f "$config_file" ]; then
        # Update VIDEO_VERSION in the config file
        sed -i.bak "s/export const VIDEO_VERSION = \".*\"/export const VIDEO_VERSION = \"$NEW_VERSION\"/" "$config_file"
        rm "${config_file}.bak"
        echo -e "${GREEN}✅ Configuration updated to use $NEW_VERSION${NC}"
    else
        echo -e "${YELLOW}⚠️  Configuration file not found at $config_file${NC}"
    fi
}

# Clean up temporary files
cleanup() {
    echo -e "${BLUE}Cleaning up temporary files...${NC}"
    # Remove generated files (keep originals)
    rm -f ${NEW_VERSION}*.mp4 ${NEW_VERSION}.webm
    rm -f video-poster*.jpg video-preview.webp
    echo -e "${GREEN}✅ Cleanup complete${NC}"
}

# Main execution
main() {
    echo -e "${GREEN}🎬 PropMatch Video Update Script${NC}"
    echo "=================================="
    echo -e "New version: ${YELLOW}$NEW_VERSION${NC}"
    echo -e "Source file: ${YELLOW}$SOURCE_VIDEO${NC}"
    echo -e "GCS bucket: ${YELLOW}gs://$BUCKET/$GCS_PATH/$NEW_VERSION${NC}"
    echo ""
    
    # Confirm before proceeding
    read -p "Continue with video processing and upload? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Operation cancelled."
        exit 0
    fi
    
    check_dependencies
    optimize_video "$SOURCE_VIDEO"
    upload_to_gcs "$NEW_VERSION"
    update_config
    cleanup
    
    echo ""
    echo -e "${GREEN}🎉 Video update complete!${NC}"
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Test the video in your application"
    echo "2. Commit the updated videoConfig.js file"
    echo "3. Deploy your application"
    echo ""
    echo -e "${BLUE}Video URLs:${NC}"
    echo "• WebM: https://storage.googleapis.com/$BUCKET/$GCS_PATH/$NEW_VERSION/$NEW_VERSION.webm"
    echo "• Optimized MP4: https://storage.googleapis.com/$BUCKET/$GCS_PATH/$NEW_VERSION/$NEW_VERSION-optimized.mp4"
    echo "• 4K MP4: https://storage.googleapis.com/$BUCKET/$GCS_PATH/$NEW_VERSION/$NEW_VERSION-4k.mp4"
}

# Run main function
main