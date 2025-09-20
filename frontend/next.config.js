/** @type {import('next').NextConfig} */
module.exports = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
  },
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
};
