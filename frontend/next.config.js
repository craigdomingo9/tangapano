/** @type {import('next').NextConfig} */
module.exports = {
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
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 0,
      ignored: ["**/node_modules"],
    };
    return config;
  },
  devIndicators: false,
  allowedDevOrigins: ["192.168.43.242"],
};
