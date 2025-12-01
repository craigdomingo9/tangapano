import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {},
  async redirects() {
    return [
      {
        source: "/",
        destination: "/portal",
        permanent: true,
      },
      {
        source: "/listing/:slug",
        destination: "/portal?page=listing&listingId=:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
