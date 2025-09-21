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
    ],
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
  // Enable SSR for better SEO
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
