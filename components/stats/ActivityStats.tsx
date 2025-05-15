import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  FiActivity,
  FiGitCommit,
  FiCode,
  FiZap,
} from "react-icons/fi";

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

interface ActivityStatsData {
  totalProjects: number;
  activeRepos: number;
  totalCommits: number | string;
}

const ActivityStats = () => {
  const [stats, setStats] = useState<ActivityStatsData>({
    totalProjects: 0,
    activeRepos: 0,
    totalCommits: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivityStats = async () => {
      setLoading(true);
      try {
        // Fetch total projects count
        const { count: totalProjects, error: projectsError } = await supabase
          .from("leaderboard_projects")
          .select("*", { count: "exact", head: true });

        if (projectsError) throw projectsError;

        // Fetch active repositories (with commits this month)
        const { count: activeRepos, error: reposError } = await supabase
          .from("leaderboard_projects")
          .select("*", { count: "exact", head: true })
          .not("published_at", "is", null);

        if (reposError) throw reposError;

        // Set static value for commits (in a real app, we'd aggregate from GitHub API data)
        // This would typically come from a pre-computed value stored in the database
        const totalCommits = "a lot, soon the value"; // Mock value between 1000-5000

        setStats({
          totalProjects: totalProjects || 0,
          activeRepos: activeRepos || 0,
          totalCommits: totalCommits,
        });
      } catch (err) {
        console.error("Error fetching activity stats:", err);
        // Keep default values in case of error
      } finally {
        setLoading(false);
      }
    };

    fetchActivityStats();
  }, []);

  // Get the current month name
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  // Stats display items
  const statItems = [
    {
      title: "Registered Projects",
      value: stats.totalProjects,
      icon: FiCode,
      color: "text-indigo-500 dark:text-indigo-400",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
    },
    {
      title: "Active Repositories",
      value: stats.activeRepos,
      icon: FiGitCommit,
      color: "text-green-500 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      suffix: ` in ${currentMonth}`
    },
    {
      title: "Total GitHub Commits",
      value: stats.totalCommits,
      icon: FiZap,
      color: "text-teal-500 dark:text-teal-400",
      bgColor: "bg-teal-100 dark:bg-teal-900/20",
      isHighlight: true
    },
  ];

  return (
    <div className="rounded-lg border border-theme-border dark:border-theme-border-dark bg-white dark:bg-secondary-dark shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-theme-border dark:border-theme-border-dark flex items-center justify-between">
        <h3 className="text-base font-semibold text-theme-title dark:text-theme-title-dark flex items-center">
          <FiActivity className="w-4 h-4 mr-2 text-red-500" />
          Developer Activity (in progress)
        </h3>
      </div>

      {/* Body */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary dark:border-primary-dark"></div>
          </div>
        ) : (
          <ul className="space-y-3">
            {statItems.map((item, index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-md ${item.bgColor} mr-3 flex-shrink-0`}>
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.title}
                      {item.suffix && <span className="text-xs italic ml-1">{item.suffix}</span>}
                    </span>
                    <p className={`font-medium ${item.isHighlight ? 'text-lg text-primary dark:text-primary-dark' : 'text-gray-800 dark:text-gray-200'}`}>
                      {item.value.toLocaleString()}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ActivityStats; 