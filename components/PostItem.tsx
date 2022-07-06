import Link from 'next/link';
import { useMemo, useState } from 'react';
import { FiBook, FiLink, FiTwitter } from 'react-icons/fi';

import { copyLinkToClipboard, getRefUrl, getShareOnTwitterUrl } from '../utils/post-item';
import { categoryPath } from '../utils/routes';

interface IPostItemTag {
  id: number;
  title: string;
}

export interface IPostItem {
  id: number;
  title: string;
  image_url: string;
  resource_url: string;
  category: string;
  category_id: number;
  description: string;
  author: string;
  tags?: IPostItemTag[];
}

export default function PostItem({ post }: { post: IPostItem }) {
  const [copyClicked, setCopyClicked] = useState(false);

  const onCopyClicked = () => {
    setCopyClicked(true);
    copyLinkToClipboard(post.resource_url);

    setTimeout(() => {
      setCopyClicked(false);
    }, 1000);
  };

  const twitterShareUrl = useMemo(() => {
    if (post?.resource_url) return getShareOnTwitterUrl(post);
    return "";
  }, [post]);

  const readArticleUrl = useMemo(() => {
    if (post?.resource_url) return getRefUrl(post.resource_url);
    return "";
  }, [post?.resource_url]);

  const tags = useMemo(() => {
    if (post?.tags?.length) {
      return post.tags
        .filter((e) => !!e)
        .map((e) => `#${e}`)
        .join(" ");
    }
    return "";
  }, [post?.tags]);

  return (
    <article className="flex flex-col w-full border-0.5 border-theme-border dark:border-theme-border-dark rounded-md bg-white dark:bg-secondary-dark-lighter shadow-sm">
      <div className="border-b-0.5 border-theme-border dark:border-theme-border-dark relative">
        <a href={readArticleUrl} target="_blank" rel="noreferrer">
          <img
            src={post.image_url}
            alt={post.title}
            className="object-cover h-44 md:h-64 w-full object-center rounded-t-md"
          />
        </a>
        <div className="absolute top-0 left-0 bg-primary dark:bg-primary-dark text-secondary dark:text-secondary-dark py-1 px-2 rounded-sm font-semibold uppercase text-xs m-5 shadow-sm">
          <Link href={categoryPath(post.category_id)}>{post.category}</Link>
        </div>
      </div>
      <div className="md:py-7 md:px-8 py-3 px-4">
        <div className="text-theme-title dark:text-theme-title-dark mb-2 text-xs sm:text-base">
          By <span className="text-primary dark:text-primary-dark">{post.author}</span>
        </div>
        <div className="font-semibold text-base sm:text-2xl text-theme-title dark:text-theme-title-dark mb-3">
          <a href={readArticleUrl} target="_blank" rel="noreferrer">
            {post.title}
          </a>
        </div>
        <p className="text-theme-text dark:text-theme-text-dark mb-4 text-xs sm:text-base">{post.description}</p>
        {post?.tags && <div className="text-xs sm:text-sm text-primary dark:text-primary-dark">{tags}</div>}
      </div>
      <div className="flex text-theme-text dark:text-theme-text-dark py-5 border-t-0.5 border-theme-border dark:border-theme-border-dark divide-x-0.5 divide-theme-border dark:divide-theme-border-dark">
        <a href={readArticleUrl} target="_blank" className="flex-1 cursor-pointer" rel="noreferrer">
          <div className="flex items-center justify-center">
            <FiBook className="mr-2 text-2xl sm:text-xl" /> <span className="hidden md:block">Open resource</span>
          </div>
        </a>
        <a href={twitterShareUrl} target="_blank" className="flex-1 cursor-pointer" rel="noreferrer">
          <div className="flex items-center justify-center">
            <FiTwitter className="mr-2 text-2xl sm:text-xl" /> <span className="hidden md:block">Share on Twitter</span>
          </div>
        </a>
        <a
          className={`flex-1 flex items-center justify-center cursor-pointer ${
            copyClicked && "pointer-events-none text-primary dark:text-primary-dark"
          }`}
          onClick={onCopyClicked}
        >
          <FiLink className="mr-2  text-2xl sm:text-xl" /> <span className="hidden md:block">Copy link</span>
        </a>
      </div>
    </article>
  );
}
