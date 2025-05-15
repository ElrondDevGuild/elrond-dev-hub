import { IPostItem } from "../components/PostItem";
import { IPostItemGrid } from "../components/PostItemGrid";
import { MediaResource } from "../types/supabase";
import { RESOURCE_BASE_URL } from "./storage_buckets";

const WEBSITE_NAME = "xdevhub.com";

const appOrigin = process.env.NEXT_PUBLIC_VERCEL_URL;

export const getRefUrl = (url: string): string => {
  const _url = new URL(url);
  _url.searchParams.set("ref", WEBSITE_NAME);
  return _url.toString();
};

const getSharePostUrl = (post: IPostItem | IPostItemGrid | MediaResource) => {
  if (post?.resource_url) {
    return getRefUrl(post.resource_url);
  }
  return "";
};

export const copyLinkToClipboard = (
  post: IPostItem | IPostItemGrid | MediaResource
) => {
  const url = getSharePostUrl(post);
  if (url && navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(url);
  }
};

export const getShareOnTwitterUrl = (
  post: IPostItemGrid | IPostItem | MediaResource,
  customMessage?: string,
  customTags?: string
) => {
  const url = encodeURIComponent(post.resource_url + "\n\n");
  const text = customMessage
    ? customMessage
    : `Check out what I found on xDevHub.io ~ ${post.title}\n`;
  const hashtags = customTags
    ? customTags.replace(/#/g, "").split(" ").join(",")
    : "MultiversX,xDevHub,MultiversXDevs";

  return `https://twitter.com/intent/tweet?url=${url}&hashtags=${hashtags}&text=${encodeURIComponent(
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
