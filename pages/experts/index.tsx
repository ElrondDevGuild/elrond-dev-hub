import { NextSeo } from "next-seo";

import ExpertItem, { IExpertItem } from "../../components/experts/ExpertItem";
import Layout from "../../components/Layout";

const expertsList: IExpertItem[] = [
  {
    name: "Razvan Statescu",
    image_url: "https://pbs.twimg.com/profile_images/1596217250767323138/vuGeZ0oJ_400x400.jpg",
    description:
      "Builder on Giants Village, CoinDrip and xDevHub. Actively supporting the devs ecosystem on MultiversX",
    socials: {
      twitter: "https://twitter.com/StatescuRazvan",
      github: "https://github.com/razvanstatescu",
      linkedin: "https://www.linkedin.com/in/razvanstatescu/",
    },
    skills: ["rust", "smart contracts", "typescript"],
  },
];

export default function ExpertsPage() {
  return (
    <Layout hideRightBar={true}>
      <NextSeo title="Technical Experts" />
      <p className="font-semibold text-2xl text-theme-text dark:text-theme-text-dark mb-2 text-center">
        MultiversX Technical Experts
      </p>
      <p className="text-theme-text dark:text-theme-text-dark mb-10 text-sm text-center">
        Are you a technical expert on MultiversX?{" "}
        <a href="https://forms.gle/GLo8roCGbuA3ePi79" target="_blank" className="underline" rel="noreferrer">
          Apply here!
        </a>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {expertsList.map((expert: IExpertItem, index) => {
          return <ExpertItem expert={expert} key={index} />;
        })}
      </div>
    </Layout>
  );
}
