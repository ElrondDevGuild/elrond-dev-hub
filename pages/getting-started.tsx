import { NextSeo } from 'next-seo';

import Layout from '../components/Layout';
import PostItemGrid, { IPostItemGrid } from '../components/PostItemGrid';

const resouresList: IPostItemGrid[] = [
  {
    title: "How to start with the Elrond blockchain development",
    image_url: "https://www.julian.io/assets/images/ogimage.png",
    resource_url: "https://www.julian.io/articles/how-to-start-with-elrond.html",
    author: "Julian Ćwirko",
  },
  {
    title: "Build a dApp in 15 minutes",
    image_url: "https://docs.elrond.com/img/share.png",
    resource_url: "https://docs.elrond.com/developers/tutorials/your-first-dapp/",
    author: "Elrond Team",
  },
];

export default function GettingStarted() {
  return (
    <Layout hideRightBar={true}>
      <NextSeo title="Getting Started" />
      <p className="font-semibold text-2xl text-theme-text dark:text-theme-text-dark mb-10 text-center">
        Getting Started with Elrond development
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {resouresList.map((post: IPostItemGrid, index) => {
          return <PostItemGrid post={post} key={index} />;
        })}
      </div>
    </Layout>
  );
}
