import { NextSeo } from "next-seo";

import Layout from "../components/Layout";
import PostItemGrid, { IPostItemGrid } from "../components/PostItemGrid";

const resouresList: IPostItemGrid[] = [
  {
    title: "Chapter 1: Create a smart contract",
    image_url:
      "https://s3.amazonaws.com/cdn.multiversx.com/webflow/tutorials_chapter-1.webp",
    resource_url:
      "https://multiversx.com/builders/tutorials/in-depth/part-1-install-required-dependencies",
    author: "Multiversx",
  },
  {
    title: "Chapter 2: Build a backend to interact with your smart contract",
    image_url:
      "https://s3.amazonaws.com/cdn.multiversx.com/webflow/tutorials_chapter-2.webp",
    resource_url:
      "https://multiversx.com/builders/tutorials/in-depth/part-1-setup-your-development-environment",
    author: "Multiversx",
  },
  {
    title: "Chapter 3: Build a frontend for your escrow app",
    image_url:
      "https://s3.amazonaws.com/cdn.multiversx.com/webflow/tutorials_chapter-3.webp",
    resource_url:
      "https://multiversx.com/builders/tutorials/in-depth/part-1-setup-your-development-environment-2",
    author: "Multiversx",
  },
  {
    title: "Get Started with AI and AI Agents",
    image_url:
      "https://cdn.multiversx.com/webflow/tutorial-ai-agents-thumb.webp",
    resource_url:
      "https://multiversx.com/builders/tutorials/in-depth/ai-agents-on-multiversx-with-eliza-framework",
    author: "Multiversx",
  },
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
    author: "Multiversx",
  },
  {
    title: "Elrond VCCode IDE Presentation & Tutorial",
    image_url: "https://i.ytimg.com/vi/bXbBfJCRVqE/maxresdefault.jpg",
    resource_url: "https://www.youtube.com/watch?v=bXbBfJCRVqE",
    author: "Multiversx",
  },
  {
    title: "Build your first Microservice",
    image_url:
      "https://dj9u8d5veywz7.cloudfront.net/content/images/size/w700/2021/10/web3-microservices-1.jpg",
    resource_url:
      "https://elrond.com/blog/build-elrond-dapps-microservice-guide/",
    author: "Multiversx",
  },
  {
    title: "Smart Contracts in minutes with the Elrond Play web IDE",
    image_url:
      "https://dj9u8d5veywz7.cloudfront.net/content/images/size/w700/2021/12/Elrond-Play-preview.jpg",
    resource_url: "https://elrond.com/blog/elrond-play-web-ide/",
    author: "Multiversx",
  },
  {
    title:
      "Elrond standard digital token standard, Non-Fungible & Semi-Fungible Token Specs",
    image_url:
      "https://dj9u8d5veywz7.cloudfront.net/content/images/2021/04/time-to-build-nfts-esdt.jpg",
    resource_url: "https://elrond.com/blog/elrond-tokens-esdt-nft-sft-specs/",
    author: "Multiversx",
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
