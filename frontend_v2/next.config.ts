import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  // Standard Webpack/Turbopack polling (works for both in v16+)
  webpack: (config) => {
    if (process.env.NODE_ENV === "development") {
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300,
      };
      return config;
    }
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/student",
        permanent: true,
      },
      {
        source: "/listing/:slug",
        destination: "/student/listing/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
