import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import Layout from '../components/Layout';
import PostItemGrid, { IPostItemGrid } from '../components/PostItemGrid';
import Pagination from '../components/shared/Pagination';
import { Category } from '../types/supabase';
import { api } from '../utils/api';

const pageSize = 12;

const fetchItems = async (page: number, category: string) => {
  const { data } = await api.get("resources", {
    params: {
      page,
      page_size: pageSize,
      category,
    },
  });
  return data;
};

const fetchCategories = async () => {
  const { data } = await api.get("categories");
  return data;
};

export default function List() {
  const router = useRouter();
  const [posts, setPosts] = useState<IPostItemGrid[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    (async () => {
      const categories = await fetchCategories();
      setCategories(categories);
    })();
  }, []);

  const categoryLabel = useMemo(() => {
    if (categories?.length && category) {
      // @ts-ignore
      return categories.find((e: Category) => e.id === parseInt(category))?.title;
    }
    return "";
  }, [category, categories]);

  const search = async () => {
    if (category) {
      const items = await fetchItems(currentPage, category);
      setPosts(items);
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
    const { category } = router.query;
    if (category) {
      (async () => {
        if (typeof category === "string") {
          setCategory(category);
        }
      })();
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (category) {
      (async () => {
        await search();
      })();
    }
  }, [currentPage]);

  useEffect(() => {
    if (category) {
      (async () => {
        await search();
      })();
    }
  }, [category]);

  return (
    <Layout hideRightBar={true}>
      <p className="font-semibold text-2xl text-theme-text dark:text-theme-text-dark mb-10">
        Search results for category: {categoryLabel}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: IPostItemGrid, index) => {
          return <PostItemGrid post={post} key={index} />;
        })}
      </div>
      <div className={`mt-8 ${loading && "pointer-events-none opacity-75"}`}>
        <Pagination hasNext={hasNext} hasPrevious={hasPrevious} onPrevious={onPrevious} onNext={onNext} />
      </div>
    </Layout>
  );
}
