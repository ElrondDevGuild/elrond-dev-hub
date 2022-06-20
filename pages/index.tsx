import { NextPage } from 'next';

import Layout from '../components/Layout';
import PostItem, { IPostItem } from '../components/PostItem';

const dummyPost: IPostItem = {
  title: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, suscipit.",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis, laboriosam. Odio et obcaecati, temporibus adipisci quasi tenetur cumque atque beatae!",
  image: "https://picsum.photos/682/350",
  category: "Category1",
  author: "John Doe",
  url: "https://elrondgiants.com",
};
const Home: NextPage = () => {
  return (
    <Layout>
      <PostItem post={dummyPost} />
    </Layout>
  );
};

export default Home;
