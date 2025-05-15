import Link from "next/link";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  FiExternalLink,
  FiGitCommit,
  FiCalendar,
  FiAward,
  FiArrowRight,
} from "react-icons/fi";
import { monthlyLeaderboardPath } from "../../utils/routes"; // Path to the full page

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Interface (can be shared or redefined here)
interface LeaderboardEntry {
  url: string;
  project_name: string;
  team_name: string;
  commits: number | null;
  lastCommitDate: string | null;
}

const LeaderboardOverview = () => {
  const [topProjects, setTopProjects] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopProjects = async () => {
      setLoading(true);
      try {
        // Fetch projects from Supabase
        const { data: supabaseProjects, error: supabaseError } = await supabase
          .from("leaderboard_projects")
          .select("url, project_name, team_name")
          .not("published_at", "is", null)
          .limit(15); // Fetch a bit more initially to ensure we get enough for sorting

        if (supabaseError) throw supabaseError;
        if (!supabaseProjects || supabaseProjects.length === 0) {
           setTopProjects([]);
           return; // Exit early if no projects
        }

        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        // Fetch commit data for these projects
        const githubPromises = supabaseProjects.map(async (project) => {
          try {
            const urlParts = project.url.split("/").filter((part: string) => part);
            if (urlParts.length < 2) return { ...project, commits: 0, lastCommitDate: null }; // Invalid URL
            const owner = urlParts[urlParts.length - 2];
            const repo = urlParts[urlParts.length - 1].replace('.git', '');
            
            const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits`;
            const params = new URLSearchParams({ since: monthStart, per_page: '1' });
            const headers: HeadersInit = { Accept: "application/vnd.github.v3+json" };
            const githubApiKey = process.env.NEXT_PUBLIC_GITHUB_API_KEY;
            if (githubApiKey) headers['Authorization'] = `Bearer ${githubApiKey}`;

            const response = await fetch(`${apiUrl}?${params.toString()}`, { headers });
            if (!response.ok) return { ...project, commits: 0, lastCommitDate: null }; // Treat errors as 0 commits for overview
            
            const commitsData = await response.json();
            let commitCount = 0;
            let lastCommitDate: string | null = null;
            if (Array.isArray(commitsData) && commitsData.length > 0) {
              lastCommitDate = commitsData[0]?.commit?.committer?.date || commitsData[0]?.commit?.author?.date || null;
              commitCount = 1; // Indicate activity
            }
            return { ...project, commits: commitCount, lastCommitDate: lastCommitDate };
          } catch (err) {
             console.warn(`Failed to fetch commits for ${project.project_name}`, err);
             return { ...project, commits: 0, lastCommitDate: null }; // Treat errors as 0
          }
        });

        const projectsWithCommits = await Promise.all(githubPromises);
        
        // Sort by commits (activity) and take top 3
        projectsWithCommits.sort((a, b) => (b.commits ?? 0) - (a.commits ?? 0));
        setTopProjects(projectsWithCommits.slice(0, 3) as LeaderboardEntry[]); 

      } catch (err: any) {
        console.error("Error fetching top projects:", err);
        setTopProjects([]); // Clear on error
      } finally {
        setLoading(false);
      }
    };

    fetchTopProjects();
  }, []);

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    try { return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); }
    catch (e) { return '-'; }
  };

  return (
    <div className="rounded-lg border border-theme-border dark:border-theme-border-dark bg-white dark:bg-secondary-dark shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-theme-border dark:border-theme-border-dark flex items-center justify-between">
        <h3 className="text-base font-semibold text-theme-title dark:text-theme-title-dark flex items-center">
          <FiAward className="w-4 h-4 mr-2 text-orange-400" />
          Monthly Leaderboard
        </h3>
        <Link href={monthlyLeaderboardPath}>
          <a className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center">
            View All <FiArrowRight className="w-3 h-3 ml-1" />
          </a>
        </Link>
      </div>

      {/* Body */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary dark:border-primary-dark"></div>
          </div>
        ) : topProjects.length === 0 ? (
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 py-4">
            No active projects found this month.
          </p>
        ) : (
          <ul className="space-y-3">
            {topProjects.map((project, index) => (
              <li key={project.url} className="flex items-center justify-between text-sm">
                <div className="flex items-center min-w-0">
                  <span className={`mr-2 font-semibold w-5 text-center ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-yellow-700 dark:text-yellow-600'}`}>
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                     <a 
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 truncate block"
                        title={project.project_name}
                      >
                        {project.project_name}
                      </a>
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate block">by {project.team_name}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                   <div className="flex items-center justify-end text-xs text-gray-600 dark:text-gray-300" title={`Commits: ${project.commits}`}> 
                       <FiGitCommit className="w-3 h-3 mr-1 text-green-500" />
                       {project.commits ?? '-'}
                   </div>
                   <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5" title={`Last Update: ${formatDate(project.lastCommitDate)}`}>
                       {formatDate(project.lastCommitDate)}
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

export default LeaderboardOverview;
