import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {},
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
