import Layout from '../components/Layout';
import PostItem from '../components/PostItem';

import type { NextPage } from "next";
const Home: NextPage = () => {
  return (
    <Layout>
      <PostItem />
    </Layout>
  );
};

export default Home;
