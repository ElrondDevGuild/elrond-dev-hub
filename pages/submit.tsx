import Layout from '../components/Layout';

export default function Submit() {
  return (
    <Layout hideRightBar={true}>
      <div className="bg-white dark:bg-secondary-dark-lighter p-6 text-theme-text dark:text-theme-text-dark rounded-md">
        <div className="flex flex-col max-w-xl mx-auto">
          <h1 className="text-center">Submit new content</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto adipisci sit, consequatur ab nostrum,
            aperiam eaque unde debitis ipsam officiis labore quo laborum voluptatibus ducimus.
          </p>
        </div>

        <div className="mt-16">form...</div>
      </div>
    </Layout>
  );
}
