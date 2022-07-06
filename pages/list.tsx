import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import Layout from '../components/Layout';
import PostItemGrid, { IPostItemGrid } from '../components/PostItemGrid';
import Loader from '../components/shared/Loader';
import Pagination from '../components/shared/Pagination';
import { Category } from '../types/supabase';
import { api } from '../utils/api';
import { categoryPath } from '../utils/routes';

const pageSize = 12;

const fetchItems = async (page: number, category: string) => {
  const {
    data: { resources, count },
  } = await api.get("resources", {
    params: {
      page,
      page_size: pageSize,
      category,
    },
  });
  return { resources, count };
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
  const [initialLoad, setInitialLoad] = useState(true);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

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
    setLoading(true);
    if (category) {
      try {
        const { resources, count } = await fetchItems(currentPage, category);
        setPosts(resources);
        setTotalPages(Math.ceil(count / pageSize));
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    }
  };

  useEffect(() => {
    if (totalPages) {
      if (currentPage + 1 < totalPages) {
        setHasNext(true);
      } else {
        setHasNext(false);
      }
    }
  }, [totalPages, currentPage]);

  const onPrevious = async () => {
    setCurrentPage(currentPage - 1);
    router.push(categoryPath(), { query: { page: currentPage - 1 + 1, category } }, { shallow: true });
  };

  const onNext = async () => {
    setCurrentPage(currentPage + 1);
    router.push(categoryPath(), { query: { page: currentPage + 1 + 1, category } }, { shallow: true });
  };

  const hasPrevious = useMemo(() => {
    return currentPage > 0;
  }, [currentPage]);

  useEffect(() => {
    const { category, page } = router.query;
    if (category) {
      (async () => {
        if (typeof category === "string") {
          setCategory(category);
        }
      })();
    }

    if (page) {
      setCurrentPage(parseInt(page as string) - 1);
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

  if (initialLoad) {
    return (
      <Layout hideRightBar={true}>
        <p className="font-semibold text-2xl text-theme-text dark:text-theme-text-dark">
          Search results for category: {categoryLabel}
        </p>
        <Loader />
      </Layout>
    );
  }

  return (
    <Layout hideRightBar={true}>
      <NextSeo title={categoryLabel} />
      <p className="font-semibold text-2xl text-theme-text dark:text-theme-text-dark mb-10">
        Search results for category: {categoryLabel}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {posts.map((post: IPostItemGrid, index) => {
          return <PostItemGrid post={post} key={index} />;
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
