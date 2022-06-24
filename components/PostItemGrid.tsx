import { useMemo, useState } from 'react';
import { FiBook, FiLink, FiTwitter } from 'react-icons/fi';

import { copyLinkToClipboard, getRefUrl, getShareOnTwitterUrl } from '../utils/post-item';

export interface IPostItemGrid {
  title: string;
  image_url: string;
  resource_url: string;
  category: string;
  author: string;
  slug: string;
}

export default function PostItemGrid({ post }: { post: IPostItemGrid }) {
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

  return (
    <div className="flex flex-col w-full border-0.5 border-theme-border dark:border-theme-border-dark rounded-md bg-white dark:bg-secondary-dark-lighter shadow-sm">
      <div className="border-b-0.5 border-theme-border dark:border-theme-border-dark">
        <a href={readArticleUrl} target="_blank" rel="noreferrer">
          <img src={post.image_url} alt={post.title} className="object-cover h-36 w-full object-center rounded-t-md" />
        </a>
      </div>
      <div className="p-4 md:px-8 md:py-6 flex-grow">
        <div className="text-theme-title dark:text-theme-title-dark mb-2 text-xs sm:text-base">By {post.author}</div>
        <div className="font-semibold text-theme-title dark:text-theme-title-dark text-base  sm:text-xl">
          <a href={readArticleUrl} target="_blank" rel="noreferrer">
            {post.title}
          </a>
        </div>
      </div>
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
            className={`flex items-center justify-center cursor-pointer ${
              copyClicked && "pointer-events-none text-primary dark:text-primary-dark"
            }`}
            onClick={onCopyClicked}
          >
            <FiLink className="text-2xl sm:text-xl" />
          </div>
        </a>
      </div>
    </div>
  );
}
