const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");

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
        protocol: "https",
        hostname: "tangapano.co.zw",
        port: "",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/150x150/**",
      },
    ],
  },
  webpack: (config) => {
    config.plugins.push(new LodashModuleReplacementPlugin());
    if (process.env.NODE_ENV === "development") {
      config.watchOptions = {
        poll: 2000,
        aggregateTimeout: 0,
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/.next/**",
          "**/coverage/**",
          "**/dist/**",
        ],
      };
    }
    return config;
  },
  devIndicators: false,
  trailingSlash: true, // Helps with URL consistency
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-robots-tag",
            value: "index, follow",
          },
        ],
      },
    ];
  },
  experimental: {
    optimizePackageImports: ["lodash", "lodash-es"],
  },
  // Enable transpilation for lodash-es if needed
  transpilePackages: ["lodash-es"],
};
