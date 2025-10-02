/** @type {import('next').NextConfig} */
module.exports = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: 'tangapano.co.zw',
        port: '',
        pathname: '/media/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  webpack: (config) => {
    if (process.env.NODE_ENV === "development") {
      config.watchOptions = {
        poll: 2000,
        aggregateTimeout: 0,
        ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/.next/**',
        '**/coverage/**',
        '**/dist/**'
      ]
      };
    }
    return config;
  },
  devIndicators: false,
  trailingSlash: true, // Helps with URL consistency
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-robots-tag',
            value: 'index, follow',
          },
        ],
      },
    ];
  },
};
