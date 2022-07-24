/** @type {import('next-sitemap').IConfig} */
import axios from 'axios';

const siteUrl = "https://egldhub.dev";

const config = {
  siteUrl,
  generateRobotsTxt: true,
  exclude: ["/thank-you", "/list", "/search"],
  priority: 1,
  additionalPaths: async (config) => {
    const result = [];

    // Get posts
    const {
      data: { resources },
    } = await axios.get(`${siteUrl}/api/resources`);
    resources?.forEach((post) => {
      result.push({
        loc: `/post/${post.slug}`,
        changefreq: "monthly",
        priority: 0.7,
        lastmod: new Date(post.published_at).toISOString(),
      });
    });

    // Get categories
    const { data: catList } = await axios.get(`${siteUrl}/api/categories`);
    catList?.forEach((category) => {
      result.push({
        loc: `/list?category=${category.id}`,
        changefreq: "weekly",
        priority: 0.6,
        lastmod: new Date().toISOString(),
      });
    });

    return result;
  },
};

export default config;
