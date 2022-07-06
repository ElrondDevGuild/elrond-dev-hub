import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { useEffect, useState } from 'react';

import Layout from '../components/Layout';
import PostItem, { IPostItem } from '../components/PostItem';
import Loader from '../components/shared/Loader';
import Pagination from '../components/shared/Pagination';
import { api } from '../utils/api';
import { homePath } from '../utils/routes';

const pageSize = 6;

const fetchItems = async (page: number) => {
  const {
    data: { resources, count },
  } = await api.get("resources", {
    params: {
      page,
      page_size: pageSize,
    },
  });

  const _resources = resources?.map((e: any) => {
    e.tags = e?.tags?.map((e: any) => e.title);
    e.category = e?.category?.title;
    return e;
  });

  return { resources: _resources, count };
};

const Home: NextPage = () => {
  const [posts, setPosts] = useState<IPostItem[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);
  const [page, setPage] = useState(0);
  const router = useRouter();

  const hasPrevious = useMemo(() => {
    return page > 0;
  }, [page]);

  const loadItems = async (page: number) => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const { resources, count } = await fetchItems(page);
      setPosts(resources);
      setPage(page);

      setTotalPages(Math.ceil(count / pageSize));
    } finally {
      setLoading(false);
      setInitialLoad(false);
      if (window) {
        document.querySelector("main")?.scrollTo(0, 0);
      }
    }
  };

  useEffect(() => {
    if (totalPages) {
      if (page + 1 < totalPages) {
        setHasNext(true);
      } else {
        setHasNext(false);
      }
    }
  }, [totalPages, page]);

  useEffect(() => {
    if (router.isReady) {
      const _page = router.query?.page as string;
      if (_page) {
        try {
          const page = parseInt(_page) - 1;
          setPage(page);
          loadItems(page);
        } catch (e) {}
      } else {
        loadItems(0);
      }
    }
  }, [router.isReady]);

  const onPrevious = async () => {
    loadItems(page - 1);
    router.push(homePath, { query: { page: page - 1 + 1 } }, { shallow: true });
  };

  const onNext = async () => {
    loadItems(page + 1);
    router.push(homePath, { query: { page: page + 1 + 1 } }, { shallow: true });
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
