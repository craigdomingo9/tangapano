module.exports = {
  siteUrl: "http://tangapano.co.zw",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  outDir: "./public",
  changefreq: "daily",
  priority: 0.9,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/partner/dashboard",
          "/partner/dashboard/*",
          "/partner/register",
        ],
      },
    ],
  },
  exclude: [
    "/partner/dashboard",
    "/_next",
    "/partner/dashboard/*",
    "/partner/register",
  ],
};
