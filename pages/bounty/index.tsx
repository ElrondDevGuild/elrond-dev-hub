import BountyItem from '../../components/bounty/BountyItem';
import Layout from '../../components/Layout';

export default function BountyListing() {
  return (
    <Layout hideRightBar={true}>
      <BountyItem />
    </Layout>
  );
}
