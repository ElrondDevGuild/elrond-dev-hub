import { NextSeo } from "next-seo";

import Layout from "../components/Layout";
import PostItemGrid, { IPostItemGrid } from "../components/PostItemGrid";

const resouresList: IPostItemGrid[] = [
  {
    title: "Elrond Network (EGLD): An Internet Scale Blockchain",
    image_url:
      "https://images.ctfassets.net/0idwgenf7ije/66MkRJSanHWi1oBkIZkgzF/d5ec1932fa64688cab01d9017d57065f/Elrond_Network__EGLD_-_An_Internet_Scale_Blockchain.jpg?fm=webp",
    resource_url:
      "https://www.gemini.com/cryptopedia/elrond-coin-egld-proof-of-stake-crypto",
    author: "Cryptopedia",
  },
  {
    title: "What is Elrond?",
    image_url:
      "https://www.ledger.com/wp-content/uploads/2021/12/thumbnail-17.png",
    resource_url: "https://www.ledger.com/academy/what-is-elrond",
    author: "Ledgeer Academy",
  },
  {
    title: "All about Elrond protocol",
    image_url:
      "https://d3lkc3n5th01x7.cloudfront.net/wp-content/uploads/2022/03/17020253/Elrond-blockchain.png",
    resource_url: "https://www.leewayhertz.com/elrond-protocol/",
    author: "LeewayHertz",
  },
  {
    title: "How to start with the Elrond blockchain development",
    image_url: "https://www.julian.io/assets/images/ogimage.png",
    resource_url:
      "https://www.julian.io/articles/how-to-start-with-elrond.html",
    author: "Julian Ćwirko",
  },
  {
    title: "Build a dApp in 15 minutes",
    image_url:
      "https://dj9u8d5veywz7.cloudfront.net/content/images/size/w700/2021/09/elrond-dapp-in-15-minutes-3.1-1.jpg",
    resource_url: "https://elrond.com/blog/elrond-dapp-fifteen-minutes/",
    author: "Elrond Team",
  },
  {
    title: "Elrond VCCode IDE Presentation & Tutorial",
    image_url: "https://i.ytimg.com/vi/bXbBfJCRVqE/maxresdefault.jpg",
    resource_url: "https://www.youtube.com/watch?v=bXbBfJCRVqE",
    author: "Elrond Team",
  },
  {
    title: "Build your first Microservice",
    image_url:
      "https://dj9u8d5veywz7.cloudfront.net/content/images/size/w700/2021/10/web3-microservices-1.jpg",
    resource_url:
      "https://elrond.com/blog/build-elrond-dapps-microservice-guide/",
    author: "Elrond Team",
  },
  {
    title: "Smart Contracts in minutes with the Elrond Play web IDE",
    image_url:
      "https://dj9u8d5veywz7.cloudfront.net/content/images/size/w700/2021/12/Elrond-Play-preview.jpg",
    resource_url: "https://elrond.com/blog/elrond-play-web-ide/",
    author: "Elrond Team",
  },
  {
    title:
      "Elrond standard digital token standard, Non-Fungible & Semi-Fungible Token Specs",
    image_url:
      "https://dj9u8d5veywz7.cloudfront.net/content/images/2021/04/time-to-build-nfts-esdt.jpg",
    resource_url: "https://elrond.com/blog/elrond-tokens-esdt-nft-sft-specs/",
    author: "Elrond Team",
  },
];

export default function GettingStarted() {
  return (
    <Layout hideRightBar={true}>
      <NextSeo title="Getting Started" />
      <p className="font-semibold text-2xl text-theme-text dark:text-theme-text-dark mb-10 text-center">
        Getting Started with MultiversX development
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resouresList.map((post: IPostItemGrid, index) => {
          return <PostItemGrid post={post} key={index} />;
        })}
      </div>
    </Layout>
  );
}
