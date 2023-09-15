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
  {
    name: "SkullElf",
    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4sQLpAd8atspul7PhRGL0mxAJ60-EZFA0yZkchEu0Sr55DQ",
    description:
      "A cyber security expert, building Discord bots and automation tools on MultiversX and other blockchains.",
    socials: {
      twitter: "https://twitter.com/BobbetBot",
      github: "https://github.com/SkullElf",
    },
    skills: ["Discord bots", "security", "python", "automation"],
  },
  {
    name: "Joaquim Tirach",
    image_url: "https://pbs.twimg.com/profile_images/1445730979398701070/AHXJEKwq_400x400.jpg",
    description: "CEO & Co-Founder of Gaupa Labs",
    socials: {
      twitter: "https://twitter.com/JoaquimTirach",
      github: "https://github.com/Jotenks66",
    },
    skills: ["Flutter", "Svelte", "Python", "Typescript"],
  },
  {
    name: "Octavian Axente",
    image_url: "https://pbs.twimg.com/profile_images/1590330064431976450/ssImFmjY_400x400.jpg",
    description: "Founder of Remarkable Tools. Building everything with C# on MultiversX",
    socials: {
      twitter: "https://twitter.com/axente_octavian",
      github: "https://github.com/axenteoctavian",
      linkedin: "https://www.linkedin.com/in/axenteoctavian/",
    },
    skills: [".NET", "Blazor", "C#", "smart contracts"],
  },
  {
    name: "Alexandru Bolog",
    image_url: "https://pbs.twimg.com/profile_images/1589033698669756419/zmhyivGf_400x400.jpg",
    description: "Full-time MultiversX builder, specialized in delivering custom solutions",
    socials: {
      twitter: "https://twitter.com/ab0lomination",
      github: "https://github.com/alexbolog",
      linkedin: "https://www.linkedin.com/in/alexbolog/",
    },
    skills: ["Smart contracts", "Architecture Design", "Rust", "JS"],
  },
  {
    name: "Micha Vie",
    image_url: "https://pbs.twimg.com/profile_images/1615413839394181121/6bNpqXKi_400x400.jpg",
    description: "Builder of PeerMe.io (DAOs on MultiversX) and Spawnable.io (Metaverse Tools).",
    socials: {
      twitter: "https://twitter.com/themichavie",
      github: "https://github.com/michavie",
    },
    skills: ["SmartContracts", "DApps", "UXDesign", "MobileDev"],
  },
  {
    name: "Mihai Călin Luca",
    image_url: "https://pbs.twimg.com/profile_images/1634946353661919232/Wbm3rdQt_400x400.jpg",
    description: "Web3 developer with over 2 years of experience on MvX.",
    socials: {
      twitter: "https://twitter.com/MihaiCalinLuca1",
      github: "https://www.linkedin.com/in/c%C4%83lin-mihai-819b21192",
      linkedin: "https://www.linkedin.com/in/c%C4%83lin-mihai-819b21192",
    },
    skills: ["Rust", "React Typescript", "Python"],
  },
].sort(() => Math.random() - 0.5);

export default function ExpertsPage() {
  return (
    <Layout hideRightBar={true}>
      <NextSeo
        title="Technical Experts"
        openGraph={{
          images: [
            {
              url: `https://xdevhub.com/og-image-experts.png`,
              width: 1200,
              height: 675,
              type: "image/png",
            },
          ],
        }}
      />
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
