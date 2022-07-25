import axios from 'axios';
import { GetServerSideProps } from 'next';
import { getServerSideSitemap, ISitemapField } from 'next-sitemap';

const siteUrl = "https://egldhub.dev";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const result: ISitemapField[] = [];

  // Get posts
  const {
    data: { resources },
  } = await axios.get(`${siteUrl}/api/resources`);
  resources?.forEach((post: any) => {
    result.push({
      loc: `${siteUrl}/post/${post.slug}`,
      changefreq: "monthly",
      priority: 0.7,
      lastmod: new Date(post.published_at).toISOString(),
    });
  });

  // Get categories
  const { data: catList } = await axios.get(`${siteUrl}/api/categories`);
  catList?.forEach((category: any) => {
    result.push({
      loc: `/list?category=${category.id}`,
      changefreq: "weekly",
      priority: 0.6,
      lastmod: new Date().toISOString(),
    });
  });

  return getServerSideSitemap(ctx, result);
};

export default function Sitemap() {}
