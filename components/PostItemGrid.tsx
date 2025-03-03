import { useMemo, useState } from 'react';
import { FiBook, FiLink, FiTwitter } from 'react-icons/fi';

import { copyLinkToClipboard, getRefUrl, getShareOnTwitterUrl } from '../utils/post-item';

export interface IPostItemGrid {
  title: string;
  description?: string;
  image_url?: string;
  resource_url: string;
  category?: string;
  author?: string;
  slug?: string;
}

interface IPostItemGridProps {
  post: IPostItemGrid;
  imageHeight?: string;
  showLinks?: boolean;
}

export default function PostItemGrid({ post, imageHeight = "h-52", showLinks = true }: IPostItemGridProps) {
  const [copyClicked, setCopyClicked] = useState(false);

  const onCopyClicked = () => {
    setCopyClicked(true);
    copyLinkToClipboard(post);

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

  return (
    <article className="flex flex-col w-full border-0.5 border-theme-border dark:border-theme-border-dark rounded-md bg-white dark:bg-secondary-dark-lighter shadow-sm overflow-hidden">
      <div className="border-b-0.5 border-theme-border dark:border-theme-border-dark">
        <a href={readArticleUrl} target="_blank" rel="noreferrer">
          <img
            src={post.image_url}
            alt={post.title}
            className={`object-cover ${imageHeight} w-full object-center rounded-t-md`}
          />
        </a>
      </div>
      <div className="p-4 md:px-6 md:py-6 flex-grow">
        {post?.author && (
          <div className="text-theme-title dark:text-theme-title-dark mb-2 text-xs sm:text-base">
            By <span className="text-primary dark:text-primary-dark">{post.author}</span>
          </div>
        )}
        <div className="font-semibold text-theme-title dark:text-theme-title-dark text-base  sm:text-xl">
          <a href={readArticleUrl} target="_blank" rel="noreferrer">
            {post.title}
          </a>
        </div>
        {post?.description && (
          <p className="text-theme-text dark:text-theme-text-dark text-xs sm:text-base mt-3">{post.description}</p>
        )}
      </div>
      {showLinks && (
        <div className="flex text-theme-text dark:text-theme-text-dark py-5 border-t-0.5 border-theme-border dark:border-theme-border-dark divide-x-0.5 divide-theme-border dark:divide-theme-border-dark">
          <a href={readArticleUrl} target="_blank" className="flex-1 cursor-pointer" rel="noreferrer">
            <div className="flex items-center justify-center">
              <FiBook className="text-2xl sm:text-xl" />
            </div>
          </a>
          <a href={twitterShareUrl} target="_blank" className="flex-1 cursor-pointer" rel="noreferrer">
            <div className="flex items-center justify-center">
              <FiTwitter className="text-2xl sm:text-xl" />
            </div>
          </a>
          <a className="flex-1 cursor-pointer">
            <div
              className={`flex items-center justify-center cursor-pointer ${copyClicked &&
                "pointer-events-none text-primary dark:text-primary-dark"}`}
              onClick={onCopyClicked}
            >
              <FiLink className="text-2xl sm:text-xl" />
            </div>
          </a>
        </div>
      )}
    </article>
  );
}
