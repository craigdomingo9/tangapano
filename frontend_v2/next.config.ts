import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {},
  async redirects() {
    return [
      {
        source: "/",
        destination: "/portal?page=home",
        permanent: true,
      },
      {
        source: "/listing/:slug",
        destination: "/portal?page=listing&listingId=:slug",
        permanent: true,
      },
    ];
  },
  poweredByHeader: false, // Hides "X-Powered-By: Next.js"
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
