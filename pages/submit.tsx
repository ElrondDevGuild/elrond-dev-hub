import { NextSeo } from "next-seo";
import Layout from "../components/Layout";
import SubmitContent from "../components/forms/SubmitContent";

export default function Submit() {
  return (
    <Layout hideRightBar={true}>
      <NextSeo title="Submit content" />
      <div className="lg:px-16 text-theme-text dark:text-theme-text-dark">
        <SubmitContent />
      </div>
    </Layout>
  );
}
