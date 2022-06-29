import { NextPage } from 'next';
import { useCallback, useMemo } from 'react';
import { useEffect, useState } from 'react';

import Layout from '../components/Layout';
import PostItem, { IPostItem } from '../components/PostItem';
import Loader from '../components/shared/Loader';
import Pagination from '../components/shared/Pagination';
import { api } from '../utils/api';

const pageSize = 6;

const fetchItems = async (page: number) => {
  const { data } = await api.get("resources", {
    params: {
      page,
      page_size: pageSize,
    },
  });

  return data?.map((e: any) => {
    e.tags = e?.tags?.map((e: any) => e.title);
    e.category = e?.category?.title;
    return e;
  });
};

const Home: NextPage = () => {
  const [posts, setPosts] = useState<IPostItem[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [page, setPage] = useState(0);

  const hasPrevious = useMemo(() => {
    return page > 0;
  }, [page]);

  const loadItems = async (page: number) => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const postsToLoad = await fetchItems(page);
      setPosts(postsToLoad);
      setPage(page);

      // Check if we have a next apge
      const nextPage = await fetchItems(page + 1);
      if (nextPage?.length) {
        setHasNext(true);
      } else {
        setHasNext(false);
      }
    } finally {
      setLoading(false);
      setInitialLoad(false);
      if (window) {
        document.querySelector("main")?.scrollTo(0, 0);
      }
    }
  };

  useEffect(() => {
    loadItems(0);
  }, []);

  const onPrevious = async () => {
    loadItems(page - 1);
  };

  const onNext = async () => {
    loadItems(page + 1);
  };

  if (initialLoad) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col space-y-8">
        {posts?.map((post, index) => (
          <PostItem key={index} post={post} />
        ))}
      </div>

      <div className={`mt-8 ${loading && "pointer-events-none opacity-75"}`}>
        <Pagination hasNext={hasNext} hasPrevious={hasPrevious} onPrevious={onPrevious} onNext={onNext} page={page} />
      </div>
    </Layout>
  );
};

export default Home;
