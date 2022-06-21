import Layout from '../components/Layout';
import PostItemGrid, { IPostItemGrid } from '../components/PostItemGrid';

const dummyPost: IPostItemGrid = {
  title: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, suscipit.",
  image: "https://picsum.photos/682/350",
  category: "Category1",
  author: "John Doe",
  url: "https://elrondgiants.com",
};

export default function Grid() {
  return (
    <Layout hideRightBar={true}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <PostItemGrid post={dummyPost} />
        <PostItemGrid post={dummyPost} />
        <PostItemGrid post={dummyPost} />
        <PostItemGrid post={dummyPost} />
        <PostItemGrid post={dummyPost} />
        <PostItemGrid post={dummyPost} />
        <PostItemGrid post={dummyPost} />
        <PostItemGrid post={dummyPost} />
      </div>
    </Layout>
  );
}
