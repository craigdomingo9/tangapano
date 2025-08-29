/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
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
        poll: 500,
        aggregateTimeout: 0,
        ignored: ["**/node_modules"],
      };
    }
    return config;
  },
  allowedDevOrigins: ['185.150.190.138'],
  devIndicators: false,
};
