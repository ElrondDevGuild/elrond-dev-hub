import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import Layout from '../components/Layout';
import PostItemGrid, { IPostItemGrid } from '../components/PostItemGrid';
import Loader from '../components/shared/Loader';
import Pagination from '../components/shared/Pagination';
import { algolia } from '../utils/search';
import { RESOURCE_BASE_URL } from '../utils/storage_buckets';

export default function Search() {
  const router = useRouter();
  const [posts, setPosts] = useState<IPostItemGrid[]>([]);
  const [query, setQuery] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const search = async (query: string) => {
    try {
      setLoading(true);
      const { hits, nbPages } = await algolia.search(query, {
        page: currentPage,
        hitsPerPage: 12,
      });
      setHasNext(currentPage < nbPages - 1);
      const results = hits?.map((e: any) => {
        if (!e?.image_url) e.image_url = `${RESOURCE_BASE_URL}resource-images/post-placeholder.jpg`;
        else if (!e?.image_url?.startsWith("http")) e.image_url = `${RESOURCE_BASE_URL}${e.image_url}`;

        return e;
      });
      setPosts(results as unknown as IPostItemGrid[]);
    } finally {
      setLoading(false);
      setInitialLoad(false);
      document.querySelector("main")?.scrollTo(0, 0);
    }
  };

  const onPrevious = async () => {
    setCurrentPage(currentPage - 1);
  };

  const onNext = async () => {
    setCurrentPage(currentPage + 1);
  };

  const hasPrevious = useMemo(() => {
    return currentPage > 0;
  }, [currentPage]);

  useEffect(() => {
    setInitialLoad(true);
    const { q } = router.query;
    if (q) {
      (async () => {
        if (typeof q === "string") {
          setQuery(q);
          await search(q);
        }
      })();
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (query) {
      (async () => {
        await search(query);
      })();
    }
  }, [currentPage]);

  if (initialLoad) {
    return (
      <Layout hideRightBar={true}>
        <p className="font-semibold text-2xl text-theme-text dark:text-theme-text-dark">
          Search results for: &quot;{query}&quot;
        </p>
        <Loader />
      </Layout>
    );
  }

  if (!loading && !posts?.length) {
    return (
      <Layout hideRightBar={true}>
        <p className="font-semibold text-2xl text-theme-text dark:text-theme-text-dark">
          No search results for: &quot;{query}&quot;. Try and search another keywords.
        </p>
      </Layout>
    );
  }

  return (
    <Layout hideRightBar={true}>
      <NextSeo title={query || ""} />
      <p className="font-semibold text-2xl text-theme-text dark:text-theme-text-dark mb-10">
        Search results for: &quot;{query}&quot;
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post: IPostItemGrid) => {
          return <PostItemGrid post={post} key={post.slug} />;
        })}
      </div>
      <div className={`mt-8 ${loading && "pointer-events-none opacity-75"}`}>
        <Pagination
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          onPrevious={onPrevious}
          onNext={onNext}
          page={currentPage}
        />
      </div>
    </Layout>
  );
}
