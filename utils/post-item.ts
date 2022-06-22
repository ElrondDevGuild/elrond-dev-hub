import { IPostItem } from '../components/PostItem';
import { IPostItemGrid } from '../components/PostItemGrid';

const WEBSITE_NAME = "egldhub.dev";

export const getRefUrl = (url: string): string => {
  const _url = new URL(url);
  _url.searchParams.set("ref", WEBSITE_NAME);
  return _url.toString();
};

export const copyLinkToClipboard = (url: string) => {
  url = getRefUrl(url);
  if (navigator?.clipboard?.writeText) navigator.clipboard.writeText(url);
};

export const getShareOnTwitterUrl = (post: IPostItemGrid | IPostItem) => {
  const url = encodeURIComponent(getRefUrl(post.url) + "\n\n");
  const text = `${post.title}\n`;
  return `https://twitter.com/intent/tweet?url=${url}&hashtags=Elrond,ElrondNetwork,ElrondDevGuild,ElrondDevHub,ElrondDevs&text=${encodeURIComponent(
    text
  )}`;
};
