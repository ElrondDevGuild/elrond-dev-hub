import Layout from '../components/Layout';

import type { NextPage } from "next";
const Home: NextPage = () => {
  return (
    <Layout>
      <div className="w-full h-64 bg-gray-600"></div>
      <div className="w-full h-64 bg-gray-600 mt-8"></div>
    </Layout>
  );
};

export default Home;
