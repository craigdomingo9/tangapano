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
    if (process.env.NODE_ENV === "development") {
      config.watchOptions = {
        poll: 500,
        aggregateTimeout: 0,
        ignored: ["**/node_modules"],
      };
    }
    return config;
  },
  devIndicators: false,
  allowedDevOrigins: ["192.168.43.242", "10.232.241.249"],
};
