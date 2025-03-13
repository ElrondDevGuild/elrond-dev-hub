import { NextSeo } from "next-seo";
import Layout from "../../components/Layout";
import { FiLink } from "react-icons/fi";
import Button from "../../components/shared/Button";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function MonthlyLeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<
    {
      url: string;
      project_name: string;
      team_name: string;
      category: string;
      status: string;
      commits?: number;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from("leaderboard_projects")
        .select("url ,project_name, team_name, category, status")
        .order("project_name", { ascending: false });

      if (error) {
        console.error("Error fetching leaderboard data:", error);
        setLoading(false);
        return;
      }

      const now = new Date();
      const monthStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      ).toISOString();

      const projectsData: { project: string; commits: number }[] = [];

      for (let repoUrl of data) {
        const parts = repoUrl.url.split("/");
        const owner = parts[3];
        const repo = parts[4];

        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?since=${monthStart}&per_page=100`;

        const headers = {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_API_KEY}`,
          Accept: "application/vnd.github.v3+json",
        };

        try {
          const response = await fetch(apiUrl, { headers });
          const commits = await response.json();

          if (Array.isArray(commits)) {
            projectsData.push({
              project: repo,
              commits: commits.length,
            });
          } else {
            console.error(
              "Error fetching commits for repo:",
              repoUrl.url,
              commits
            );
          }
        } catch (error) {
          console.error("Error during fetch for repo:", repoUrl.url, error);
        }
      }

      // Update leaderboard with commit counts
      const updatedLeaderboard = data.map((project) => {
        const projectData = projectsData.find(
          (p) => p.project === project.project_name
        );
        return projectData
          ? { ...project, commits: projectData.commits }
          : project;
      });

      setLeaderboard(updatedLeaderboard);
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  return (
    <Layout hideRightBar={true}>
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
          <p className="text-xs text-gray-700 dark:text-gray-300 mb-4">
            Project with most commits will earn{" "}
            <span className="text-xs font-semibold text-orange-500 dark:text-orange-300">
              15 EGLD
            </span>{" "}
            monthly reward.
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-theme-title dark:text-theme-title-dark mb-4">
            Monthly Leaderboard
          </h1>
          <p className="text-md md:text-lg text-theme-text dark:text-theme-text-dark max-w-2xl mx-auto pb-4">
            This initiative aim to reward the most active contributors in the
            ecosystem by simply tracking the commits on GitHub.
          </p>
          {/* <div className="flex items-center justify-center">
            <Button
              class="mx-auto w-fit"
              label="Submit your project here"
              icon={FaPlus}
              href="#"
            ></Button>
          </div> */}
        </div>
        <div className="p-6 border-theme-border dark:border-theme-border-dark rounded-md overflow-y-auto bg-white dark:bg-secondary-dark-lighter">
          {loading ? (
            <p className="text-black dark:text-theme-text-dark">Loading...</p>
          ) : (
            <div className="overflow-x-auto min-h-32">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="text-black dark:text-theme-text-dark border-b dark:border-gray-700">
                  <tr>
                    <th className="rounded-md p-2 text-center text-xs font-medium uppercase tracking-wider">
                      Position
                    </th>
                    <th className="rounded-md p-2 text-center text-xs font-medium uppercase tracking-wider">
                      Project
                    </th>
                    <th className="rounded-md p-2 text-center text-xs font-medium uppercase tracking-wider">
                      Commits
                    </th>
                    <th className="rounded-md p-2 text-center text-xs font-medium uppercase tracking-wider">
                      Category
                    </th>
                    <th className="rounded-md p-2 text-center text-xs font-medium uppercase tracking-wider">
                      Team Name
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-transparent text-black dark:text-theme-text-dark text-sm divide-y divide-gray-200 dark:divide-gray-700">
                  {leaderboard.map((projectData, index) => (
                    <tr key={projectData.team_name}>
                      <td className="p-2 whitespace-nowrap text-center">
                        {index === 0
                          ? "🥇"
                          : index === 1
                          ? "🥈"
                          : index === 2
                          ? "🥉"
                          : index + 1}
                      </td>
                      <td className="p-2 whitespace-nowrap text-center">
                        <span className="font-semibold text-blue-500 dark:text-blue-300">
                          <Link
                            href={`https://github.com/${projectData.project_name}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <a target="_blank" rel="noreferrer">
                              {projectData.project_name}
                            </a>
                          </Link>
                        </span>
                      </td>
                      <td className="p-2 whitespace-nowrap text-center">
                        <span className="font-semibold text-green-500 dark:text-green-300">
                          {projectData.commits}
                        </span>{" "}
                        🚀
                      </td>
                      <td className="p-2 whitespace-nowrap text-center">
                        {projectData.category}
                      </td>
                      <td className="p-2 whitespace-nowrap text-center">
                        {projectData.team_name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="text-center mt-12">
          <p className="text-theme-text dark:text-theme-text-dark mb-4">
            Want to join the leaderboard? Submit your project on below.
          </p>
          <a
            href="https://forms.gle/SX8Kgw7go4WmS5eP9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-white font-semibold py-3 px-6 rounded-full hover:bg-primary-dark dark:bg-primary-dark dark:hover:bg-primary transition-colors duration-200"
          >
            Submit Project <FiLink className="inline-block ml-2" />
          </a>
        </div>
      </section>
    </Layout>
  );
}
