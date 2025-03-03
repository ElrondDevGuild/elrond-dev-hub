import { NextSeo } from "next-seo";
import Layout from "../../components/Layout";
import { FiLink } from "react-icons/fi";
import Button from "../../components/shared/Button";
import CategoryBadge from "../../components/shared/CategoryBadge";
import { useState } from "react";

// Interface for the project data structure
interface ProjectItem {
  title: string;
  assignees: string | null;
  status: string;
  openSource: string;
  estimatedCompletion: string;
  category: string;
  team: string;
  link: string | null;
}

export default function DecenterPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("title");

  const projectData: ProjectItem[] = [
    {
      title: "MultiversX DeCenter",
      assignees: "schmim and xAllianceMVX",
      status: "In Development",
      openSource: "Open Source",
      estimatedCompletion: "Oct 28, 2024",
      category: "Community",
      team: "xAlliance",
      link: null,
    },
    {
      title: "Ecosystem Calendar",
      assignees: "Joetinks56 and xAllianceMVX",
      status: "Live",
      openSource: "Open Source",
      estimatedCompletion: "Oct 9, 2024",
      category: "Infrastructure & Tools",
      team: "xAlliance",
      link: "https://calendar.xalliance.io",
    },
    {
      title: "Saturn",
      assignees: "BubuMVX and xAllianceMVX",
      status: "Live",
      openSource: "Closed Source",
      estimatedCompletion: "Sep 6, 2023",
      category: "Infrastructure & Tools",
      team: "Project X",
      link: null,
    },
    {
      title: "EDGE",
      assignees: "BubuMVX and xAllianceMVX",
      status: "Live",
      openSource: "Closed Source",
      estimatedCompletion: "Apr 1, 2024",
      category: "Infrastructure & Tools",
      team: "Project X",
      link: null,
    },
    {
      title: "Flutter SDK",
      assignees: "schmim and xAllianceMVX",
      status: "Maintenance",
      openSource: "Open Source",
      estimatedCompletion: "Jan 1, 2025",
      category: "Infrastructure & Tools",
      team: "N/A (solo dev)",
      link: null,
    },
    {
      title: "Bounty Payout Module",
      assignees: "michavie",
      status: "Live",
      openSource: "Open Source",
      estimatedCompletion: "Jun 13, 2024",
      category: "Infrastructure & Tools",
      team: "PeerMe",
      link: null,
    },
    {
      title: "Vanity Wallet Address Generator",
      assignees: "BubuMVX",
      status: "Live",
      openSource: "Open Source",
      estimatedCompletion: "Jun 13, 2024",
      category: "Wallets",
      team: "Project X",
      link: "https://wallet.artmakers.io/",
    },
    {
      title: "xPortal Daily Task",
      assignees: "BubuMVX",
      status: "In Development",
      openSource: "Partly Open Source",
      estimatedCompletion: "Oct 28, 2024",
      category: "Gaming",
      team: "Project X",
      link: "https://xportal.artmakers.io/",
    },
    {
      title: "Easy Faucet for Desktop",
      assignees: "BubuMVX",
      status: "Live",
      openSource: "Open Source",
      estimatedCompletion: "Oct 28, 2024",
      category: "Infrastructure & Tools",
      team: "Project X",
      link: "https://github.com/BubuMVX/easy-faucet",
    },
    {
      title: "Alias Export Key",
      assignees: "BubuMVX",
      status: "Live",
      openSource: "Open Source",
      estimatedCompletion: "Sep 6, 2024",
      category: "Wallets",
      team: "Project X",
      link: "https://github.com/BubuMVX/alias-export-key",
    },
    {
      title: "MultiversX Wallet for Telegram",
      assignees: "BubuMVX",
      status: "In Development",
      openSource: "Closed Source",
      estimatedCompletion: "Apr 6, 2025",
      category: "Wallets",
      team: "Project X",
      link: "https://t.me/MultiversX_Wallet_Bot",
    },
    {
      title: "Rug Royalties",
      assignees: "BubuMVX",
      status: "Live",
      openSource: "Closed Source",
      estimatedCompletion: "Jun 13, 2024",
      category: "Others",
      team: "Divergent Club",
      link: "https://rug.divergentclub.xyz/",
    },
    {
      title: "Mx Native Stablecoin",
      assignees: null,
      status: "In Development",
      openSource: "Open Source",
      estimatedCompletion: "Oct 28, 2024",
      category: "Defi",
      team: "Hatom",
      link: null,
    },
  ];

  // Filter projects based on the activeCategory value.
  const filteredProjects =
    activeCategory === "all"
      ? projectData
      : projectData.filter((item) => item.category === activeCategory);

  console.log(
    "Rendering DecenterPage with",
    filteredProjects.length,
    "filtered items"
  );

  return (
    <Layout hideRightBar>
      <NextSeo
        title="DeCenter - Ongoing Open Source Development Efforts"
        description="Explore and contribute to open-source MultiversX projects. Streamline tool and application building with the DeCenter community."
        openGraph={{
          images: [
            {
              url: `https://xdevhub.com/og-image.png`,
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
            DeCenter
          </h1>
          <p className="text-md md:text-lg text-theme-text dark:text-theme-text-dark max-w-2xl mx-auto pb-4">
            A hub for ongoing open-source development efforts in the MultiversX
            ecosystem. Everyone can contribute to the projects listed below or submit their own projects for review.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-colors duration-200 ${
                activeCategory === "all"
                  ? "bg-primary text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-theme-text dark:text-theme-text-dark hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              All Projects
            </button>
            {Array.from(new Set(projectData.map((item) => item.category))).map(
              (category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-colors duration-200 ${
                    activeCategory === category
                      ? "bg-primary text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-theme-text dark:text-theme-text-dark hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {category}
                </button>
              )
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((item, index) => (
              <>
                <div
                  key={index}
                  className="bg-secondary dark:bg-secondary-dark rounded-xl shadow-lg p-6 border border-theme-border/30 dark:border-theme-border-dark/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  {" "}
                  <div
                    className={`absolute top-0 left-0 w-full h-1 ${
                      item.status === "Live" ? "bg-green-500" : "bg-blue-500"
                    }`}
                  ></div>
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="flex justify-between items-start mb-4">
                      <CategoryBadge
                        size="sm"
                        category={item.category}
                        className="z-10"
                      />
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.status === "Live"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : item.status === "In Development"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-theme-title dark:text-theme-title-dark mb-3 group-hover:text-primary dark:group-hover:text-primary-dark transition-colors duration-200">
                      {item.title}
                    </h2>

                    <div className="space-y-1 mb-6">
                      <div className="flex text-sm">
                        <div className="w-28 text-theme-text/60 dark:text-theme-text-dark/60">
                          Team:
                        </div>
                        <div className="font-medium text-theme-text dark:text-theme-text-dark">
                          {item.team}
                        </div>
                      </div>
                      <div className="flex text-sm">
                        <div className="w-28 text-theme-text/60 dark:text-theme-text-dark/60">
                          Source:
                        </div>
                        <div className="font-medium text-theme-text dark:text-theme-text-dark">
                          {item.openSource}
                        </div>
                      </div>
                      <div className="flex text-sm">
                        <div className="w-28 text-theme-text/60 dark:text-theme-text-dark/60">
                          Assignees:
                        </div>
                        <div className="font-medium text-theme-text dark:text-theme-text-dark">
                          {item.assignees || "None"}
                        </div>
                      </div>
                      <div className="flex text-sm">
                        <div className="w-28 text-theme-text/60 dark:text-theme-text-dark/60">
                          Est. <br></br>Completion:
                        </div>
                        <div className="font-medium text-theme-text dark:text-theme-text-dark">
                          {item.estimatedCompletion}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-auto z-50">
                      <Button
                        label="Contribute"
                        href="https://github.com/multiversx"
                      />
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-3 rounded-full bg-gray-100 hover:bg-primary/10 dark:bg-gray-800 dark:hover:bg-primary-dark/20 text-theme-text dark:text-theme-text-dark hover:text-primary dark:hover:text-primary-dark transition-colors duration-200"
                          title="Visit project"
                        >
                          <FiLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ))
          ) : (
            <p className="text-center col-span-full text-theme-text dark:text-theme-text-dark">
              No projects found at this time.
            </p>
          )}
        </div>
        <div className="text-center mt-12">
          <p className="text-theme-text dark:text-theme-text-dark mb-4">
            Want to contribute? Join the MultiversX DeCenter open-source community!
          </p>
          <a
            href="https://github.com/multiversx"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-white font-semibold py-3 px-6 rounded-full hover:bg-primary-dark dark:bg-primary-dark dark:hover:bg-primary transition-colors duration-200"
          >
            Explore on GitHub
          </a>
        </div>
      </section>
    </Layout>
  );
}
