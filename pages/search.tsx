import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import Layout from '../components/Layout';
import PostItemGrid, { IPostItemGrid } from '../components/PostItemGrid';
import Pagination from '../components/shared/Pagination';
import { algolia } from '../utils/search';

export default function Search() {
  const router = useRouter();
  const [posts, setPosts] = useState<IPostItemGrid[]>([]);
  const [query, setQuery] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);

  const search = async (query: string) => {
    try {
      setLoading(true);
      const { hits, nbPages } = await algolia.search(query, {
        page: currentPage,
      });
      setHasNext(currentPage < nbPages - 1);
      setPosts(hits as unknown as IPostItemGrid[]);
    } finally {
      setLoading(false);
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

  return (
    <Layout hideRightBar={true}>
      <p className="font-semibold text-2xl text-theme-text dark:text-theme-text-dark mb-10">
        Search results for: &quot;{query}&quot;
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: IPostItemGrid) => {
          return <PostItemGrid post={post} key={post.slug} />;
        })}
      </div>
      <div className={`mt-8 ${loading && "pointer-events-none opacity-75"}`}>
        <Pagination hasNext={hasNext} hasPrevious={hasPrevious} onPrevious={onPrevious} onNext={onNext} />
      </div>
    </Layout>
  );
}
