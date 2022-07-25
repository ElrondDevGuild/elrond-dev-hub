/** @type {import('next-sitemap').IConfig} */
const siteUrl = "https://egldhub.dev";

const config = {
  siteUrl,
  generateRobotsTxt: true,
  exclude: ["/thank-you", "/list", "/search", "/server-sitemap.xml"],
  priority: 1,
  robotsTxtOptions: {
    additionalSitemaps: [`${siteUrl}/server-sitemap.xml`],
  },
};

export default config;
