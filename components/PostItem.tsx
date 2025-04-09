import Link from "next/link";
import { useMemo, useState } from "react";
import { FiBook, FiShare2, FiCopy, FiCheck } from "react-icons/fi";

import {
  copyLinkToClipboard,
  getRefUrl,
  getShareOnTwitterUrl,
} from "../utils/post-item";
import { categoryPath } from "../utils/routes";
import CategoryBadge from "./shared/CategoryBadge";

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
  slug?: string;
  published_at: string;
}

export default function PostItem({ post }: { post: IPostItem }) {
  const [copyClicked, setCopyClicked] = useState(false);

  const onCopyClicked = () => {
    setCopyClicked(true);
    copyLinkToClipboard(post);

    setTimeout(() => {
      setCopyClicked(false);
    }, 1000);
  };

  const twitterShareUrl = useMemo(() => {
    if (!post?.resource_url) return "";

    // Create a more engaging Twitter message
    const tags = "#MultiversX #MultiversXNetwork #MultiversXDevs #xDevHub";
    const customMessage = `🔥 Just discovered this amazing resource: "${post.title}" 🚀\n\nCheck it out and level up your MultiversX development skills! 💻✨\n\n`;

    return getShareOnTwitterUrl(post, customMessage, tags);
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
    <article className="flex flex-col w-full border-0.5 border-theme-border dark:border-theme-border-dark rounded-md bg-white dark:bg-secondary-dark-lighter shadow-sm overflow-hidden">
      <div className="border-b-0.5 border-theme-border dark:border-theme-border-dark relative">
        <a
          href={readArticleUrl}
          target="_blank"
          rel="noreferrer"
          className="z-50"
        >
          <img
            src={post.image_url}
            alt={post.title}
            className="object-cover h-44 md:h-64 w-full object-center rounded-t-md"
          />
        </a>
        <div className="flex justify-between items-start absolute bottom-0 right-0 m-5 gap-2">
          <CategoryBadge
            size="lg"
            category={new Date(post.published_at)
              .toLocaleString("default", {
                month: "2-digit",
                year: "numeric",
                day: "numeric",
              })
              .toLowerCase()}
            className="z-10 opacity-50"
          />
          <CategoryBadge
            size="lg"
            category={post.category.toLowerCase()}
            className="z-10"
          />
        </div>
      </div>
      <div className="md:py-7 md:px-8 py-3 px-4">
        <div className="text-theme-title dark:text-theme-title-dark mb-2 text-xs sm:text-base">
          built by{" "}
          <span className="text-primary dark:text-primary-dark">
            {post.author}
          </span>
        </div>
        <div className="font-semibold text-base sm:text-2xl text-theme-title dark:text-theme-title-dark mb-3">
          <a href={readArticleUrl} target="_blank" rel="noreferrer">
            {post.title}
          </a>
        </div>
        <p className="text-theme-text dark:text-theme-text-dark mb-4 text-xs sm:text-base">
          {post.description}
        </p>
        {post?.tags && (
          <div className="text-xs sm:text-sm text-primary dark:text-primary-dark">
            {tags}
          </div>
        )}
      </div>
      <div className="flex text-theme-text dark:text-theme-text-dark py-5 border-t-0.5 border-theme-border dark:border-theme-border-dark divide-x-0.5 divide-theme-border dark:divide-theme-border-dark">
        <a
          href={readArticleUrl}
          target="_blank"
          className="flex-1 cursor-pointer group relative hover:text-primary dark:hover:text-primary-dark transition-colors"
          rel="noreferrer"
          title="Read original article"
        >
          <div className="flex flex-col items-center justify-center">
            <FiBook className="text-xl sm:text-lg mb-1" />
            <span className="text-xs font-medium">Read More</span>
          </div>
        </a>
        <a
          href={twitterShareUrl}
          target="_blank"
          className="flex-1 cursor-pointer group relative hover:text-primary dark:hover:text-primary-dark transition-colors"
          rel="noreferrer"
          title="Share on Twitter"
        >
          <div className="flex flex-col items-center justify-center">
            <FiShare2 className="text-xl sm:text-lg mb-1" />
            <span className="text-xs font-medium">Share</span>
          </div>
        </a>
        <a
          className="flex-1 cursor-pointer group relative hover:text-primary dark:hover:text-primary-dark transition-colors"
          onClick={(e) => {
            e.preventDefault();
            onCopyClicked();
          }}
          title="Copy link to clipboard"
        >
          <div
            className={`flex flex-col items-center justify-center ${
              copyClicked &&
              "pointer-events-none text-primary dark:text-primary-dark"
            }`}
          >
            {copyClicked ? (
              <FiCheck className="text-xl sm:text-lg mb-1" />
            ) : (
              <FiCopy className="text-xl sm:text-lg mb-1" />
            )}
            <span className="text-xs font-medium">{copyClicked ? "Copied!" : "Copy Link"}</span>
          </div>
        </a>
      </div>
    </article>
  );
}
