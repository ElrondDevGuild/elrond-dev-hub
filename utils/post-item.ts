import { MediaResource } from '../types/supabase';
import { RESOURCE_BASE_URL } from './storage_buckets';
import {IPostItem, IPostItemGrid} from "../types/components";

const WEBSITE_NAME = "xdevhub.com";

const appOrigin = process.env.NEXT_PUBLIC_VERCEL_URL;

export const getRefUrl = (url: string): string => {
  const _url = new URL(url);
  _url.searchParams.set("ref", WEBSITE_NAME);
  return _url.toString();
};

const getSharePostUrl = (post: IPostItem | IPostItemGrid | MediaResource) => {
  if (post?.slug) return `${appOrigin}/post/${post.slug}`;
  return getRefUrl(post.resource_url);
};

export const copyLinkToClipboard = (post: IPostItem | IPostItemGrid | MediaResource) => {
  if (navigator?.clipboard?.writeText) navigator.clipboard.writeText(getSharePostUrl(post));
};

export const getShareOnTwitterUrl = (post: IPostItemGrid | IPostItem | MediaResource) => {
  const url = encodeURIComponent(getSharePostUrl(post) + "\n\n");
  const text = `${post.title}\n`;
  return `https://twitter.com/intent/tweet?url=${url}&hashtags=MultiversX,MultiversXNetwork,ElrondDevGuild,xDevHub,MultiversXDevs&text=${encodeURIComponent(
    text
  )}`;
};

export const getFullImageUrl = (resource: MediaResource) => {
  if (!resource?.image_url) {
    return `${RESOURCE_BASE_URL}resource-images/post-placeholder.jpg`;
  } else if (!resource?.image_url?.startsWith("http")) {
    return `${RESOURCE_BASE_URL}${resource.image_url}`;
  }
  return resource.image_url;
};
