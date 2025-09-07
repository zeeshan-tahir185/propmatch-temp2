/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  },
  images: {
    unoptimized: true
  },
  trailingSlash: false,
  distDir: '.next',
  // Optimize video serving with proper headers
  async headers() {
    return [
      {
        source: '/demo/:path*.(mp4|webm|mov)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
          {
            key: 'Accept-Ranges',
            value: 'bytes'
          },
          {
            key: 'Content-Type',
            value: 'video/mp4'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      },
      {
        source: '/demo/:path*.webm',
        headers: [
          {
            key: 'Content-Type',
            value: 'video/webm'
          }
        ]
      },
      {
        source: '/demo/:path*.mov',
        headers: [
          {
            key: 'Content-Type',
            value: 'video/quicktime'
          }
        ]
      },
      {
        source: '/fonts/:path*.(woff|woff2|ttf|otf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
          {
            key: 'Content-Type',
            value: 'font/woff'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          }
        ]
      }
    ]
  }
};

export default nextConfig;
