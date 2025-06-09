/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Handle PDF.js worker files
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/87.pdf',
        destination: '/public/87.pdf',
      },
      {
        source: '/gmail_animation.gif',
        destination: '/public/gmail_animation.gif',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;