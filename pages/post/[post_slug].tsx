import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import { useEffect, useMemo, useState } from 'react';
import { FiCopy, FiExternalLink, FiTwitter } from 'react-icons/fi';
import Moment from 'react-moment';

import Layout from '../../components/Layout';
import PostItemGrid, { IPostItemGrid } from '../../components/PostItemGrid';
import Button from '../../components/shared/Button';
import { MediaResource } from '../../types/supabase';
import { RESOURCES_TABLE } from '../../utils/dbtables';
import { copyLinkToClipboard, getFullImageUrl, getRefUrl, getShareOnTwitterUrl } from '../../utils/post-item';
import { homePath } from '../../utils/routes';
import { supabaseAdmin } from '../../utils/supabase';

export default function PostPage({ post, morePosts }: { post: MediaResource; morePosts: IPostItemGrid[] }) {
  const [copyClicked, setCopyClicked] = useState(false);

  const onCopyClicked = () => {
    setCopyClicked(true);
    copyLinkToClipboard(post);

    setTimeout(() => {
      setCopyClicked(false);
    }, 1000);
  };

  const tags = useMemo(() => {
    if (post?.tags?.length) {
      return post.tags
        .filter((e) => !!e)
        .map((e) => `#${e}`)
        .join(" ");
    }
    return "";
  }, [post?.tags]);

  const shareUrl = useMemo(() => {
    return getRefUrl(post.resource_url);
  }, [post?.resource_url]);

  const twitterShareUrl = useMemo(() => {
    if (post?.resource_url) return getShareOnTwitterUrl(post);
    return "";
  }, [post]);

  return (
    <Layout hideRightBar={true}>
      <NextSeo
        title={post.title}
        description={post.description}
        openGraph={{
          images: [
            {
              url: post.image_url as string,
            },
          ],
        }}
      />

      <div className="text-theme-text dark:text-theme-text-dark">
        <div className="flex sm:space-x-16 flex-col sm:flex-row space-y-3 sm:space-y-0">
          <div className="sm:w-2/3">
            <h1 className="font-semibold text-base sm:text-2xl text-theme-title dark:text-theme-title-dark mb-3">
              {post.title}
            </h1>

            <div>
              <a href={shareUrl} target="_blank" rel="noreferrer">
                <img
                  src={post.image_url as string}
                  alt={post.title}
                  className="object-cover h-44 md:h-64 w-full object-center rounded-md"
                />
              </a>

              <div className="text-theme-title dark:text-theme-title-dark mb-2 text-xs sm:text-base mt-3">
                Posted by <span className="text-primary dark:text-primary-dark">{post.author}</span>,{" "}
                <Moment fromNow>{post.created_at}</Moment>
              </div>

              <p className="text-theme-text dark:text-theme-text-dark mb-4 text-xs sm:text-base mt-3">
                {post.description}
              </p>

              {post?.tags && <div className="text-xs sm:text-sm text-primary dark:text-primary-dark">{tags}</div>}
            </div>
          </div>
          <div className="sm:w-1/3">
            <Button label="Read resource" href={shareUrl} theme="secondary" icon={FiExternalLink} />

            <div className="mt-8">
              <h2 className="uppercase text-primary dark:text-primary-dark font-semibold text-xs mb-3">
                Would you recommend this resource?
              </h2>
              <div className="flex text-theme-text dark:text-theme-text-dark space-x-4">
                <a className="cursor-pointer">
                  <div
                    className={`flex items-center justify-center cursor-pointer ${
                      copyClicked && "pointer-events-none text-primary dark:text-primary-dark"
                    }`}
                    onClick={onCopyClicked}
                  >
                    <FiCopy className="text-2xl" />
                  </div>
                </a>
                <a href={twitterShareUrl} target="_blank" className="cursor-pointer" rel="noreferrer">
                  <div className="flex items-center justify-center">
                    <FiTwitter className="text-2xl" />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        {morePosts?.length > 0 && (
          <div className="mt-16">
            <h2 className="text-primary dark:text-primary-dark font-semibold mb-4 text-xl">You might also like...</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {morePosts.map((post: IPostItemGrid, index) => {
                return <PostItemGrid post={post} key={index} />;
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { post_slug } = ctx.query;

  // Get post
  const { data, error } = await supabaseAdmin
    .from<MediaResource>(RESOURCES_TABLE)
    .select("*")
    .eq("slug", post_slug as string)
    .maybeSingle();

  if (error || !data) {
    return {
      redirect: {
        permanent: false,
        destination: homePath,
      },
      props: {},
    };
  }

  data.image_url = getFullImageUrl(data);

  // Get 3 random posts
  const { data: randomResources } = await supabaseAdmin.from<MediaResource>("random_resources").select("*").limit(4);

  return {
    props: {
      post: data,
      morePosts: randomResources
        ?.map((resource) => {
          resource.image_url = getFullImageUrl(resource);
          // @ts-ignore
          resource.description = null;
          return resource;
        })
        .filter((resource) => resource.id !== data.id)
        .slice(0, 3),
    },
  };
};
