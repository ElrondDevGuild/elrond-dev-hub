import Link from "next/link";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const MonthlyCodingLeaderboard = () => {
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
        .select("url ,project_name, team_name, category")
        .not("publish_date", "is", null)
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
      const updatedLeaderboard = data.map(
        (project: {
          url: string;
          project_name: string;
          team_name: string;
          category: string;
          status: string;
        }) => {
          const projectData = projectsData.find(
            (p) => p.project === project.project_name
          );
          return projectData
            ? { ...project, commits: projectData.commits }
            : project;
        }
      );

      setLeaderboard(updatedLeaderboard);
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className=" border-r-0.5 border-0.5 border-theme-border dark:border-theme-border-dark rounded-md overflow-y-auto ">
      <div className="px-6 py-4 bg-white dark:bg-secondary-dark rounded-md">
        <h2 className="text-2xl font-bold mb-2 text-black dark:text-theme-text-dark">
          Monthly Leaderboard
        </h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          Project with most commits will win{" "}
          <span className="font-semibold text-orange-500 dark:text-orange-300">
            15 EGLD
          </span>{" "}
          monthly reward.
        </p>
      </div>
      <div className="p-6 border-theme-border dark:border-theme-border-dark rounded-md overflow-y-auto bg-white dark:bg-secondary-dark-lighter">
        {loading ? (
          <p className="text-black dark:text-theme-text-dark">
            Loding cool projects...
          </p>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyCodingLeaderboard;
