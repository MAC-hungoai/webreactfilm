/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false, // Disable SWC minify to avoid Railway memory issues
  typescript: {
    ignoreBuildErrors: false,
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    return [
      // Proxy movie API calls to backend server (only for development)
      // Production uses direct NEXT_PUBLIC_API_URL
      {
        source: '/api/movies/:path*',
        destination: `${apiUrl}/movies/:path*`,
      },
    ];
  },
}

module.exports = nextConfig
