import { NextSeo } from "next-seo";

import ExpertItem, { IExpertItem } from "../../components/experts/ExpertItem";
import Layout from "../../components/Layout";

const expertsList: IExpertItem[] = [
  {
    name: "Razvan Statescu",
    image_url:
      "https://pbs.twimg.com/profile_images/1779775395870416896/sQ1-Jg7v_400x400.jpg",
    description:
      "Builder on Giants Village, CoinDrip and xDevHub. Actively supporting the devs ecosystem on MultiversX",
    socials: {
      twitter: "https://twitter.com/StatescuRazvan",
      github: "https://github.com/razvanstatescu",
      linkedin: "https://www.linkedin.com/in/razvanstatescu/",
    },
    skills: ["rust", "smart contracts", "typescript"],
  },
  // {
  //   name: "SkullElf",
  //   image_url:
  //     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4sQLpAd8atspul7PhRGL0mxAJ60-EZFA0yZkchEu0Sr55DQ",
  //   description:
  //     "A cyber security expert, building Discord bots and automation tools on MultiversX and other blockchains.",
  //   socials: {
  //     twitter: "https://twitter.com/BobbetBot",
  //     github: "https://github.com/SkullElf",
  //   },
  //   skills: ["Discord bots", "security", "python", "automation"],
  // },
  {
    name: "Joaquim Tirach 🙂",
    image_url:
      "https://pbs.twimg.com/profile_images/1887297209764397056/GHJGY6YQ_400x400.jpg",
    description: "CEO & Co-Founder of Gaupa Labs",
    socials: {
      twitter: "https://twitter.com/JoaquimTirach",
      github: "https://github.com/Jotenks66",
    },
    skills: ["Flutter", "Svelte", "Python", "Typescript"],
  },
  {
    name: "Octavian Axente 🙂",
    image_url:
      "https://pbs.twimg.com/profile_images/1716175323375505408/nVCIB_m7_400x400.jpg",
    description:
      "Founder of Remarkable Tools. Building everything with C# on MultiversX",
    socials: {
      twitter: "https://twitter.com/axente_octavian",
      github: "https://github.com/axenteoctavian",
    },
    skills: [".NET", "Blazor", "C#", "smart contracts"],
  },
  {
    name: "Alexandru Bolog",
    image_url:
      "https://pbs.twimg.com/profile_images/1589033698669756419/zmhyivGf_400x400.jpg",
    description:
      "Full-time MultiversX builder, specialized in delivering custom solutions",
    socials: {
      twitter: "https://twitter.com/ab0lomination",
      github: "https://github.com/alexbolog",
      linkedin: "https://www.linkedin.com/in/alexbolog/",
    },
    skills: ["Smart contracts", "Architecture Design", "Rust", "JS"],
  },
  {
    name: "Micha Vie 🙂",
    image_url:
      "https://pbs.twimg.com/profile_images/1831285227265613825/Azkmzsa8_400x400.jpg",
    description:
      "Architect of PeerMe, JoAi, Tagrity, Spawnable and Warp Protocol.",
    socials: {
      twitter: "https://x.com/michavie_",
      github: "https://github.com/michavie",
    },
    skills: ["SmartContracts", "DApps", "UXDesign", "MobileDev"],
  },
  {
    name: "Mihai Călin Luca 🙂",
    image_url:
      "https://pbs.twimg.com/profile_images/1728014441797554176/FwnQR0Yp_400x400.jpg",
    description: "Web3 developer with over 2 years of experience on MvX.",
    socials: {
      twitter: "https://twitter.com/MihaiCalinLuca1",
      github: "https://github.com/mihaicalinluca",
      linkedin: "https://www.linkedin.com/in/c%C4%83lin-mihai-819b21192",
    },
    skills: ["Rust", "React Typescript", "Python"],
  },
  {
    name: "Philippe Martin",
    image_url:
      "https://pbs.twimg.com/profile_images/1836486909574406144/2uHPCx4d_400x400.jpg",
    description:
      "Versatile software engineer with expertise across multiple domains, dedicated staking provider for MultiversX, and entrepreneur offering Internal Development Platforms (IDP) to bootstrap new ideas and elevate existing projects.",
    socials: {
      twitter: "https://x.com/PhyByte",
      github: "https://github.com/PhyByte",
      linkedin: "https://www.linkedin.com/in/martinzphilippe/?locale=en_US",
    },
    skills: ["Dev/Sec Ops", "Fullstack", "Automation", "Management"],
  },
  {
    name: "Aurélien Passion",
    image_url:
      "https://pbs.twimg.com/profile_images/1766822366854713345/r0X0YlRQ_400x400.jpg",
    description: "Founder of JEXchangeDefi",
    socials: {
      twitter: "https://twitter.com/JavierNFT",
      github: "https://github.com/javier-nft",
    },
    skills: ["Rust", "ReactJS", "Python"],
  },
  {
    name: "Bucur David",
    image_url:
      "https://pbs.twimg.com/profile_images/1695157716816158720/rWPXIUFQ_400x400.jpg",
    description: "Builder on MvX",
    socials: {
      linkedin: "https://www.linkedin.com/in/david-bucur",
      github: "https://github.com/bucurdavid",
      email: "dbucur22@gmail.com",
    },
    skills: ["SmartContracts", "DApps", "Backend"],
  },
  {
    name: "Martin Wagner",
    image_url:
      "https://pbs.twimg.com/profile_images/1641362154392633344/7H5qaypC_400x400.jpg",
    description:
      "🛠 Building Knights of Cathena on MultiversX. 🥇 Winner of the MultiversX Most Valuable Developer Evangelist Award.",
    socials: {
      twitter: "https://twitter.com/mwfiae",
      github: "https://github.com/mwfiae",
      linkedin: "https://www.linkedin.com/in/martin-wagner-3b4519257",
    },
    skills: ["Smartcontracts", "Gaming", "Rust", "Typescript"],
  },
  {
    name: "Marius Stoica",
    image_url:
      "https://pbs.twimg.com/profile_images/1643900763611987969/p_QzXwRz_400x400.jpg",
    description: "Software Engineer @ buidly",
    socials: {
      twitter: "https://twitter.com/mstoica95",
      github: "https://github.com/stoicamarius",
      linkedin: "https://www.linkedin.com/in/marius-stoica-9713b0b7/",
    },
    skills: ["Native Android & iOS development", "full-stack development"],
  },
  {
    name: "Julian Ćwirko 🙂",
    image_url:
      "https://pbs.twimg.com/profile_images/1398985202047803394/fVtUp8Vo_400x400.png",
    description: "Web developer. Indie tools maintainer. xDevGuild member.",
    socials: {
      twitter: "https://twitter.com/theJulianIo",
      github: "https://github.com/juliancwirko",
    },
    skills: ["Next.js", "React", "TypeScript", "Node", "Rust"],
  },
  {
    name: "Bubu 🙂",
    image_url: "https://media.elrond.com/nfts/thumbnail/TITANS-20bc2c-e3b35361",
    description:
      "Long-time full-stack web developer with a wide range of technical skills",
    socials: {
      twitter: "https://x.com/BubuMVX",
      github: "https://github.com/BubuMVX",
    },
    skills: ["React", "TypeScript", "HTML", "CSS", "PHP", "MySQL", "AdminSys"],
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
      <section className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-theme-title dark:text-theme-title-dark mb-4">
            MultiversX Technical Experts
          </h1>
          <p className="text-md md:text-lg text-theme-text dark:text-theme-text-dark max-w-2xl mx-auto pb-4">
            Are you a technical expert on MultiversX?{" "}
            <a
              href="https://forms.gle/GLo8roCGbuA3ePi79"
              target="_blank"
              className="underline"
              rel="noreferrer"
            >
              Apply here!
            </a>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {expertsList.map((expert: IExpertItem, index) => {
            return <ExpertItem expert={expert} key={index} />;
          })}
        </div>
      </section>
    </Layout>
  );
}
