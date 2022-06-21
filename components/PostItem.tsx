import { useState } from 'react';
import { FiBook, FiLink, FiTwitter } from 'react-icons/fi';

const copyToClipboard = (text: string) => {
  if (navigator?.clipboard?.writeText) navigator.clipboard.writeText(text);
};

export interface IPostItem {
  title: string;
  image: string;
  url: string;
  category: string;
  description: string;
  author: string;
  tags?: string[];
}

export default function PostItem({ post }: { post: IPostItem }) {
  const [copyClicked, setCopyClicked] = useState(false);

  const onCopyClicked = () => {
    setCopyClicked(true);
    copyToClipboard(post.url);

    setTimeout(() => {
      setCopyClicked(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full border-0.5 border-theme-border dark:border-theme-border-dark rounded-md bg-white dark:bg-secondary-dark-lighter shadow-sm">
      <div className="border-b-0.5 border-theme-border dark:border-theme-border-dark">
        <a href={post.url} target="_blank" rel="noreferrer">
          <img src={post.image} alt={post.title} className="object-cover h-64 w-full object-center rounded-t-md" />
        </a>
      </div>
      <div className="py-7 px-8">
        <div className="text-theme-title dark:text-theme-title-dark mb-2">By {post.author}</div>
        <div className="font-semibold text-2xl text-theme-title dark:text-theme-title-dark mb-3">
          <a href={post.url} target="_blank" rel="noreferrer">
            {post.title}
          </a>
        </div>
        <p className="text-theme-text dark:text-theme-text-dark mb-4">{post.description}</p>
        {post?.tags && <div className="text-sm text-primary dark:text-primary-dark">{post.tags}</div>}
      </div>
      <div className="flex text-theme-text dark:text-theme-text-dark py-5 border-t-0.5 border-theme-border dark:border-theme-border-dark divide-x-0.5 divide-theme-border dark:divide-theme-border-dark">
        <a href={post.url} target="_blank" className="flex-1 cursor-pointer" rel="noreferrer">
          <div className="flex items-center justify-center">
            <FiBook className="mr-2 text-2xl sm:text-xl" /> <span className="hidden md:block">Read article</span>
          </div>
        </a>
        <a href="#" className="flex-1 cursor-pointer">
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
    </div>
  );
}
