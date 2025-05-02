import { NextSeo } from "next-seo";
import Layout from "../../components/Layout";
import React, { useEffect, useState, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  FiExternalLink,
  FiGitCommit,
  FiCalendar,
  FiInfo,
  FiAward,
  FiPlusCircle,
  FiCode,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiX,
  FiRefreshCw
} from "react-icons/fi";
import Button from "../../components/shared/Button";
import Image from "next/image";
import SubmitLeaderboardProject from "../../components/forms/SubmitLeaderboardProject";

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Interface for Leaderboard Data
interface LeaderboardEntry {
      url: string;
      project_name: string;
      team_name: string;
      category: string;
  status?: string;
  commits: number | null;
  lastCommitDate: string | null;
}

// Add pagination settings
const ITEMS_PER_PAGE = 10;

// Custom Button wrapper to add onClick functionality
const CustomButton = ({ 
  label, 
  icon, 
  onClick, 
  theme, 
  class: className 
}: { 
  label: string; 
  icon?: any; 
  onClick: () => void; 
  theme?: "primary" | "secondary"; 
  class?: string; 
}) => {
  return (
    <div onClick={onClick}>
      <Button 
        label={label} 
        icon={icon} 
        theme={theme} 
        class={className} 
      />
    </div>
  );
};

// --- Main Page Component ---
export default function MonthlyLeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Advanced filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [minCommits, setMinCommits] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [lastUpdatedFilter, setLastUpdatedFilter] = useState<string>("all");

  // Fetching Logic
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch 100 projects at a time for better performance
        const { data: supabaseProjects, error: supabaseError } = await supabase
        .from("leaderboard_projects")
        .select("url, project_name, team_name, category")
        .not("publish_date", "is", null)
          .order("project_name", { ascending: true })
          .limit(100); // We'll implement client-side pagination after filtering

        if (supabaseError) throw supabaseError;
        if (!supabaseProjects) throw new Error("No projects found.");

      const now = new Date();
      const monthStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      ).toISOString();

        const githubPromises = supabaseProjects.map(async (project) => {
          try {
            const urlParts = project.url.split("/").filter((part: string) => part);
            if (urlParts.length < 2) throw new Error('Invalid GitHub URL format');
            const owner = urlParts[urlParts.length - 2];
            const repo = urlParts[urlParts.length - 1].replace('.git', '');

            const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits`;
            const params = new URLSearchParams({ since: monthStart, per_page: '1' });
            const headers: HeadersInit = { Accept: "application/vnd.github.v3+json" };
            const githubApiKey = process.env.NEXT_PUBLIC_GITHUB_API_KEY;
            if (githubApiKey) headers['Authorization'] = `Bearer ${githubApiKey}`;

            const response = await fetch(`${apiUrl}?${params.toString()}`, { headers });

            if (!response.ok) {
              if (response.status === 404) {
                console.warn(`Repo not found or private: ${owner}/${repo}`);
                return { ...project, commits: 0, lastCommitDate: null };
              } else if (response.status === 403) {
                console.warn(`Rate limit likely hit for ${owner}/${repo}.`);
                return { ...project, commits: null, lastCommitDate: null };
              }
              throw new Error(`GitHub API error (${response.status}) for ${owner}/${repo}`);
            }

            const commitsData = await response.json();
            let commitCount = 0;
            let lastCommitDate: string | null = null;

            if (Array.isArray(commitsData) && commitsData.length > 0) {
              lastCommitDate = commitsData[0]?.commit?.committer?.date || commitsData[0]?.commit?.author?.date || null;
              // NOTE: Commit count logic is simplified (indicates activity)
              commitCount = 1; 
            }

            return { ...project, commits: commitCount, lastCommitDate: lastCommitDate };
          } catch (fetchError: any) {
            console.error(`Error processing project ${project.project_name}:`, fetchError.message);
            return { ...project, commits: null, lastCommitDate: null };
          }
        });

        const projectsWithCommits = await Promise.all(githubPromises);
        const validProjects = projectsWithCommits.filter((p) => p.commits !== null) as LeaderboardEntry[];
        validProjects.sort((a, b) => (b.commits ?? 0) - (a.commits ?? 0));
        setLeaderboard(validProjects);

      } catch (err: any) {
        console.error("Error fetching leaderboard:", err);
        setError(`Failed to load leaderboard: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Formatting function
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  // Get unique categories for filter buttons
  const categories = Array.from(
    new Set(leaderboard.map((item) => item.category))
  );

  // Apply all filters to the projects
  const filteredProjects = useMemo(() => {
    return leaderboard.filter(project => {
      // Category filter
      if (activeCategory !== "all" && project.category !== activeCategory) {
        return false;
      }
      
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          project.project_name.toLowerCase().includes(searchLower) ||
          project.team_name.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }
      
      // Minimum commits filter
      if (minCommits && project.commits !== null) {
        if (project.commits < parseInt(minCommits, 10)) {
          return false;
        }
      }
      
      // Last updated filter
      if (lastUpdatedFilter !== "all" && project.lastCommitDate) {
        const commitDate = new Date(project.lastCommitDate);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - commitDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (lastUpdatedFilter === "week" && daysDiff > 7) return false;
        if (lastUpdatedFilter === "month" && daysDiff > 30) return false;
      }
      
      return true;
    });
  }, [leaderboard, activeCategory, searchTerm, minCommits, lastUpdatedFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  // Handle page changes
  const goToPage = (page: number) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
    // Scroll to top of table
    document.getElementById("leaderboard-table")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setActiveCategory("all");
    setMinCommits("");
    setLastUpdatedFilter("all");
    setCurrentPage(1);
  };

  // --- JSX for the Page ---
  return (
    <Layout hideRightBar={true}>
      <NextSeo
        title="Monthly Dev Leaderboard | MultiversX Dev Hub"
        description="Track monthly GitHub activity for MultiversX projects and compete for EGLD rewards."
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
        {/* Header section with slightly reduced padding */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary-dark/10 dark:to-primary-dark/20 rounded-2xl p-6 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-4xl font-bold text-theme-title dark:text-theme-title-dark mb-4 relative">
              Monthly Developer Leaderboard
              <div className="absolute w-14 h-0.5 bg-primary dark:bg-primary-dark left-1/2 transform -translate-x-1/2 bottom-0"></div>
            </h1>
            <p className="text-sm md:text-base text-theme-text dark:text-theme-text-dark max-w-3xl mx-auto">
              Compete for <span className="font-bold text-primary dark:text-primary-dark">15 EGLD</span> monthly rewards by building in public. 
              Your contributions elevate the MultiversX ecosystem and get the recognition they deserve.
            </p>
          </div>
          
          <div className="flex justify-center">
            <CustomButton 
              label="Submit Your Project" 
              onClick={() => setShowSubmitForm(true)}
              icon={FiPlusCircle}
              class="text-sm py-2 px-4"
            />
          </div>
        </div>

        {/* Value Proposition Card - more compact */}
        <div className="max-w-5xl mx-auto mb-8 bg-white dark:bg-secondary-dark rounded-xl overflow-hidden shadow-lg border border-theme-border dark:border-theme-border-dark">
          <div className="px-4 py-3 border-b border-theme-border dark:border-theme-border-dark bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-secondary-dark">
            <div className="flex items-center gap-3">
              <FiInfo className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-theme-title dark:text-theme-title-dark">Turn Your Code into EGLD!</h2>
                <p className="text-xs text-gray-600 dark:text-gray-300">Already building on MultiversX? Share your work and get rewarded!</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full">
                    <FiCode className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-theme-title dark:text-theme-title-dark">Make Your Repo Public</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Share your MultiversX projects with the community and let others learn from your work.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-full">
                    <FiGitCommit className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-theme-title dark:text-theme-title-dark">Keep Coding & Committing</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Active repositories with regular commits have a better chance of winning the monthly prize.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-1.5 rounded-full">
                    <FiAward className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-theme-title dark:text-theme-title-dark">Win Monthly Rewards</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">The project with the most activity each month wins <span className="font-bold text-orange-500 dark:text-orange-400">15 EGLD</span>.</p>
                  </div>
                </div>
                
                <div className="mt-4 text-center md:text-left">
                  <CustomButton 
                    label="Submit Your Project" 
                    onClick={() => setShowSubmitForm(true)}
                    icon={FiPlusCircle}
                    class="text-xs py-1.5 px-3"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* More compact filters section */}
        <div className="mb-5 bg-white dark:bg-secondary-dark rounded-xl shadow-lg p-3 border border-theme-border dark:border-theme-border-dark">
          <div className="flex flex-col md:flex-row justify-between items-center mb-3">
            <div className="mb-3 md:mb-0">
              <h2 className="text-base font-semibold text-theme-title dark:text-theme-title-dark flex items-center">
                <span className="mr-2">Projects</span>
                {filteredProjects.length > 0 && (
                  <span className="text-xs font-normal text-theme-text/60 dark:text-theme-text-dark/60">
                    ({filteredProjects.length} found)
            </span>
                )}
              </h2>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {/* Search box */}
              <div className="relative w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                  className="pl-7 pr-7 py-1.5 text-xs rounded-md border border-theme-border dark:border-theme-border-dark bg-gray-50 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary-dark w-full md:w-auto"
                />
                <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-theme-text/50 dark:text-theme-text-dark/50 w-3 h-3" />
                {searchTerm && (
                  <button 
                    onClick={() => {
                      setSearchTerm("");
                      setCurrentPage(1);
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-theme-text/50 dark:text-theme-text-dark/50 hover:text-theme-text dark:hover:text-theme-text-dark"
                  >
                    <FiX size={12} />
                  </button>
                )}
              </div>

              {/* Filter toggle */}
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 ${
                  showFilters 
                    ? "bg-primary/10 text-primary dark:bg-primary-dark/10 dark:text-primary-dark" 
                    : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <FiFilter className={`w-3 h-3 ${showFilters ? "text-primary dark:text-primary-dark" : ""}`} />
                {showFilters ? "Hide Filters" : "Filters"}
              </button>
            </div>
          </div>

          {/* Condensed advanced filters panel */}
          {showFilters && (
            <div className="pt-2 border-t border-theme-border/30 dark:border-theme-border-dark/30">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-2">
                {/* Category filter - takes more space */}
                <div className="md:col-span-5">
                  <label className="block text-xs font-medium text-theme-text dark:text-theme-text-dark mb-1">Category</label>
                  <div className="flex flex-wrap gap-1">
                    <button
                      onClick={() => {
                        setActiveCategory("all");
                        setCurrentPage(1);
                      }}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                        activeCategory === "all"
                          ? "bg-primary text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      All
                    </button>
                    {categories.slice(0, 4).map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setActiveCategory(category);
                          setCurrentPage(1);
                        }}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                          activeCategory === category
                            ? "bg-primary text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                    {categories.length > 4 && (
                      <div className="relative group">
                        <button
                          className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          +{categories.length - 4} more
                        </button>
                        <div className="absolute left-0 mt-1 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-md p-1.5 z-20 hidden group-hover:block">
                          <div className="flex flex-col space-y-1 max-h-40 overflow-y-auto">
                            {categories.slice(4).map((category) => (
                              <button
                                key={category}
                                onClick={() => {
                                  setActiveCategory(category);
                                  setCurrentPage(1);
                                }}
                                className={`px-2 py-0.5 text-left rounded-md text-xs font-medium transition-colors duration-200 ${
                                  activeCategory === category
                                    ? "bg-primary/20 text-primary dark:text-primary-dark"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                              >
                                {category}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Minimum commits filter */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-theme-text dark:text-theme-text-dark mb-1">Min. Commits</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={minCommits}
                    onChange={(e) => {
                      setMinCommits(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="py-1.5 px-2 w-full text-xs rounded-md border border-theme-border dark:border-theme-border-dark bg-gray-50 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary-dark"
                  />
                </div>

                {/* Last updated filter */}
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-theme-text dark:text-theme-text-dark mb-1">Last Updated</label>
                  <select
                    value={lastUpdatedFilter}
                    onChange={(e) => {
                      setLastUpdatedFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="py-1.5 px-2 w-full text-xs rounded-md border border-theme-border dark:border-theme-border-dark bg-gray-50 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary-dark"
                  >
                    <option value="all">Any time</option>
                    <option value="week">Last 7 days</option>
                    <option value="month">Last 30 days</option>
                  </select>
                </div>

                {/* Reset filters button */}
                <div className="md:col-span-2 flex items-end">
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 py-1.5 px-2 text-xs bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 w-full justify-center"
                  >
                    <FiRefreshCw size={10} />
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Leaderboard Table - more compact */}
        <div id="leaderboard-table" className="rounded-lg overflow-hidden shadow-lg border border-theme-border dark:border-theme-border-dark bg-white dark:bg-secondary-dark mb-6">
          <div className="px-4 py-3 border-b border-theme-border dark:border-theme-border-dark bg-gray-50 dark:bg-secondary-dark-lighter">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-semibold text-theme-title dark:text-theme-title-dark flex items-center gap-1.5">
                <FiAward className="text-orange-500 w-4 h-4" /> Current Standings
              </h2>
              
              {/* Pagination info */}
              {filteredProjects.length > 0 && (
                <div className="text-xs text-theme-text/60 dark:text-theme-text-dark/60">
                  Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredProjects.length)} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredProjects.length)} of {filteredProjects.length}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary dark:border-primary-dark"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 dark:text-red-400 p-4 bg-red-100 dark:bg-red-900/40 rounded-lg border border-red-200 dark:border-red-800/50 m-4">
              <p className="font-semibold text-sm">Oops! Couldn&apos;t load the leaderboard.</p>
              <p className="mt-1 text-xs">{error}</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 p-6 m-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50">
              <p className="font-semibold text-sm">No projects are currently competing.</p>
              <p className="mt-2 text-xs">Be the first to submit your project for next month&apos;s leaderboard!</p>
              <div className="mt-4">
                <CustomButton 
                  label="Submit Your Project" 
                  onClick={() => setShowSubmitForm(true)}
                  icon={FiPlusCircle}
                  theme="secondary"
                  class="text-xs py-1.5 px-3"
                />
              </div>
            </div>
          ) : (
            <div className="p-3">
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-gray-700 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-100 dark:bg-gray-800/60">
                  <tr>
                          <th scope="col" className="py-2 pl-3 pr-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider sm:pl-4">
                      Rank
                    </th>
                          <th scope="col" className="px-2 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                      Project
                    </th>
                          <th scope="col" className="px-2 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                      Commits
                    </th>
                          <th scope="col" className="px-2 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                            Last Update
                    </th>
                  </tr>
                </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-secondary-dark">
                        {paginatedProjects.map((project, index) => {
                          // Calculate true index for ranking
                          const rankIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
                          
                          return (
                            <tr key={project.url} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors duration-150">
                              <td className={`whitespace-nowrap py-2 pl-3 pr-2 text-center text-base sm:text-lg font-bold sm:pl-4 ${rankIndex === 0 ? 'text-yellow-500' : rankIndex === 1 ? 'text-gray-400 dark:text-gray-300' : rankIndex === 2 ? 'text-yellow-700 dark:text-yellow-600' : 'text-gray-600 dark:text-gray-400'}`}>
                                {rankIndex === 0 ? "🥇" : rankIndex === 1 ? "🥈" : rankIndex === 2 ? "🥉" : rankIndex + 1}
                      </td>
                              <td className="whitespace-nowrap px-2 py-2 text-xs">
                                <div className="flex items-center">
                                  <div className="ml-0">
                                    <a 
                                      href={project.url}
                            target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-semibold text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 inline-flex items-center group"
                                      title={`Visit ${project.project_name} on GitHub`}
                                    >
                                      {project.project_name}
                                      <FiExternalLink className="w-3 h-3 ml-1 flex-shrink-0 opacity-70 group-hover:opacity-100" />
                                    </a>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">by {project.team_name}</div>
                                  </div>
                                </div>
                      </td>
                              <td className="whitespace-nowrap px-2 py-2 text-center text-xs">
                                <div className="flex items-center justify-center text-gray-800 dark:text-gray-200">
                                  <FiGitCommit className="w-3 h-3 mr-1 text-green-600 dark:text-green-400 flex-shrink-0" />
                                  <span className="font-semibold">{project.commits ?? '-'}</span> 
                                  <span className="text-[10px] ml-1 text-gray-500 dark:text-gray-400">this month</span>
                                </div>
                      </td>
                              <td className="whitespace-nowrap px-2 py-2 text-center text-xs text-gray-600 dark:text-gray-300">
                                <div className="flex items-center justify-center">
                                  <FiCalendar className="w-3 h-3 mr-1 flex-shrink-0 opacity-80" />
                                  {formatDate(project.lastCommitDate)}
                                </div>
                      </td>
                    </tr>
                          );
                        })}
                </tbody>
              </table>
            </div>
        </div>
              </div>

              {/* Pagination Controls - more compact */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md ${
                      currentPage === 1
                        ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                        : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    <FiChevronLeft size={12} /> Prev
                  </button>
                  
                  <div className="flex items-center">
                    {/* Page number buttons - show max 5 buttons with ellipsis */}
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      
                      // Always show first, last, current page and 1 page before/after current
                      if (
                        pageNum === 1 || 
                        pageNum === totalPages || 
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            className={`w-6 h-6 mx-0.5 flex items-center justify-center rounded-md text-xs ${
                              currentPage === pageNum
                                ? "bg-primary text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                      
                      // Show ellipsis if there's a gap between shown pages
                      if (
                        (pageNum === 2 && currentPage > 3) || 
                        (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                      ) {
                        return (
                          <span key={pageNum} className="mx-0.5 text-xs text-theme-text dark:text-theme-text-dark">
                            ...
                          </span>
                        );
                      }
                      
                      return null;
                    })}
            </div>
                  
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md ${
                      currentPage === totalPages
                        ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                        : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    Next <FiChevronRight size={12} />
                  </button>
          </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Submit Project Modal */}
      {showSubmitForm && (
        <SubmitLeaderboardProject onClose={() => setShowSubmitForm(false)} />
      )}
    </Layout>
  );
}
