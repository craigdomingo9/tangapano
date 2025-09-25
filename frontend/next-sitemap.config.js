module.exports = {
  siteUrl: 'http://tangapano.co.zw',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  outDir: './public',
  changefreq: 'daily',
  priority: 0.9,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' , disallow: ['/dashboard', '/dashboard/*', '/register']},
    ],
  },
  exclude: ['/dashboard', '/_next', '/dashboard/*', '/register'],
};