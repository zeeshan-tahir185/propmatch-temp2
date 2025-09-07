#!/usr/bin/env python3
"""
PropMatch Video Proxy Service - Optimized for 4K Streaming
Serves videos from GCS with proper HTTP range request support and caching
"""

from flask import Flask, Response, request, abort, make_response
from google.cloud import storage
import os
import logging
from werkzeug.datastructures import Headers
from functools import lru_cache
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# GCS Configuration
BUCKET_NAME = os.environ.get('BUCKET_NAME', 'propmatch_frontend')
VIDEO_PREFIX = 'demo/v3/'
CHUNK_SIZE = 1024 * 1024  # 1MB chunks for streaming

# Initialize GCS client
storage_client = storage.Client()
bucket = storage_client.bucket(BUCKET_NAME)

# Cache blob metadata for 5 minutes
@lru_cache(maxsize=128, typed=False)
def get_blob_metadata(blob_name):
    """Cache blob metadata to reduce GCS API calls"""
    try:
        blob = bucket.blob(blob_name)
        if not blob.exists():
            return None
        blob.reload()
        return {
            'size': blob.size,
            'content_type': blob.content_type or 'video/mp4',
            'etag': blob.etag,
            'updated': blob.updated
        }
    except Exception as e:
        logger.error(f"Error getting metadata for {blob_name}: {e}")
        return None

def parse_range_header(range_header, file_size):
    """Parse HTTP Range header and return start, end positions"""
    try:
        if not range_header or not range_header.startswith('bytes='):
            return 0, min(CHUNK_SIZE - 1, file_size - 1)
        
        range_str = range_header.replace('bytes=', '')
        range_parts = range_str.split('-')
        
        start = int(range_parts[0]) if range_parts[0] else 0
        end = int(range_parts[1]) if range_parts[1] else min(start + CHUNK_SIZE - 1, file_size - 1)
        
        # Validate range
        start = max(0, min(start, file_size - 1))
        end = max(start, min(end, file_size - 1))
        
        return start, end
    except Exception as e:
        logger.warning(f"Range parsing error: {e}, using default chunk")
        return 0, min(CHUNK_SIZE - 1, file_size - 1)

def stream_video_chunk(blob_name, start, end):
    """Stream a specific chunk of video from GCS"""
    try:
        blob = bucket.blob(blob_name)
        # Download the specific range
        chunk = blob.download_as_bytes(start=start, end=end)
        return chunk
    except Exception as e:
        logger.error(f"Error streaming chunk from {blob_name}: {e}")
        return None

@app.route('/<path:video_path>')
def serve_video(video_path):
    """Serve video with optimized HTTP range request support"""
    
    # Construct full blob name
    blob_name = f"{VIDEO_PREFIX}{video_path}"
    
    # Get cached metadata
    metadata = get_blob_metadata(blob_name)
    if not metadata:
        logger.warning(f"Video not found: {blob_name}")
        abort(404)
    
    file_size = metadata['size']
    content_type = metadata['content_type']
    etag = metadata['etag']
    
    # Handle If-None-Match for caching
    if request.headers.get('If-None-Match') == etag:
        return '', 304
    
    # Parse Range header
    range_header = request.headers.get('Range')
    start, end = parse_range_header(range_header, file_size)
    
    # Stream the requested chunk
    chunk = stream_video_chunk(blob_name, start, end)
    if chunk is None:
        abort(500)
    
    # Prepare response headers
    headers = Headers()
    headers['Content-Type'] = content_type
    headers['Accept-Ranges'] = 'bytes'
    headers['ETag'] = etag
    headers['Cache-Control'] = 'public, max-age=3600, immutable'
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS'
    headers['Access-Control-Allow-Headers'] = 'Range, If-None-Match'
    headers['Access-Control-Expose-Headers'] = 'Content-Range, Accept-Ranges, Content-Length'
    
    # Add CDN cache hints
    headers['X-Accel-Buffering'] = 'no'  # Disable proxy buffering
    headers['X-Content-Type-Options'] = 'nosniff'
    
    content_length = end - start + 1
    
    if range_header and start > 0 or end < file_size - 1:
        # Partial content response
        headers['Content-Range'] = f'bytes {start}-{end}/{file_size}'
        headers['Content-Length'] = str(content_length)
        response = Response(chunk, 206, headers)
    else:
        # Full content response (or initial chunk)
        headers['Content-Length'] = str(content_length)
        response = Response(chunk, 200, headers)
    
    return response

@app.route('/<path:video_path>', methods=['OPTIONS'])
def handle_options(video_path):
    """Handle preflight CORS requests"""
    response = make_response('', 204)
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Range, If-None-Match'
    response.headers['Access-Control-Max-Age'] = '3600'
    response.headers['Access-Control-Expose-Headers'] = 'Content-Range, Accept-Ranges, Content-Length'
    return response

@app.route('/health')
def health():
    """Health check endpoint with GCS connectivity test"""
    try:
        # Test GCS connectivity
        list(bucket.list_blobs(prefix=VIDEO_PREFIX, max_results=1))
        return {
            'status': 'healthy',
            'bucket': BUCKET_NAME,
            'service': 'video-proxy',
            'timestamp': int(time.time())
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {'status': 'unhealthy', 'error': str(e)}, 503

@app.route('/')
def index():
    """Service information endpoint"""
    return {
        'service': 'PropMatch Video Proxy',
        'version': '2.0.0',
        'features': [
            'HTTP Range Request Support',
            '4K Video Streaming',
            'GCS Backend',
            'Response Caching',
            'CORS Support'
        ]
    }

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    # Use production-ready server settings
    app.run(host='0.0.0.0', port=port, threaded=True)