import { NextSeo } from "next-seo";
import Layout from "../../components/Layout";
import { FiLink, FiStar, FiClock, FiDownload, FiBook, FiSearch, FiX, FiPlusCircle, FiGrid, FiList, FiRefreshCw } from "react-icons/fi";
import { FaLink } from "react-icons/fa";
import Button from "../../components/shared/Button";
import CategoryBadge from "../../components/shared/CategoryBadge";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import RequestUpdate from "../../components/forms/RequestUpdate";
import SubmitDecenter from "../../components/forms/SubmitDecenter";

// Interface for the project data structure
interface ProjectItem {
  id: number;
  title: string;
  assignees: string | null;
  status: string;
  open_source: string;
  estimated_completion: string;
  category: string;
  team: string;
  link: string | null;
  description: string;
  stars: number;
  star_votes: string[];
  matchedDeveloper?: {
    name: string;
    profileUrl: string;
  } | null;
  last_activity?: string;
  github_stars?: number;
  downloads?: number;
  documentation_url?: string;
  updated_at?: string;
}

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to match developers with projects
const matchDeveloper = async (
  assignee: string
): Promise<{ name: string; profileUrl: string } | null> => {
  try {
    const { data, error } = await supabase
      .from("tf_developers")
      .select("name, github_url")
      .ilike("name", `%${assignee}%`)
      .limit(1);

    if (error) {
      console.error("Error matching developer:", error);
      return null;
    }

    if (data && data.length > 0) {
      return {
        name: data[0].name,
        profileUrl: `/team-finder?developer=${encodeURIComponent(
          data[0].name
        )}`,
      };
    }

    return null;
  } catch (error) {
    console.error("Error in matchDeveloper:", error);
    return null;
  }
};

export default function DecenterPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const [projectData, setProjectData] = useState<ProjectItem[]>([]);
  const [userIP, setUserIP] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null
  );
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Get user's IP address
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => setUserIP(data.ip))
      .catch((error) => console.error("Error fetching IP:", error));
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      const today = new Date().toISOString();

      const { data, error } = await supabase
        .from("decenter")
        .select("*")
        .lte("publish_date", today)
        .not("publish_date", "is", null)
        .order("status", { ascending: true });

      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        // Process projects to handle idle status and match developers
        const processedData = await Promise.all(
          data.map(async (project) => {
            const completionDate = new Date(project.estimated_completion);
            const today = new Date();
            const lastUpdate = project.updated_at
              ? new Date(project.updated_at)
              : null;
            const fifteenDaysAgo = new Date();
            fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

            let matchedDeveloper = null;
            if (project.assignees) {
              matchedDeveloper = await matchDeveloper(project.assignees);
            }

            // Mark as idle if completion date passed or no updates in 15 days
            if (
              (completionDate < today && project.status !== "Live") ||
              (lastUpdate &&
                lastUpdate < fifteenDaysAgo &&
                project.status !== "Live")
            ) {
              return {
                ...project,
                status: "Idle",
                category: "Idle",
                matchedDeveloper,
              };
            }
            return {
              ...project,
              matchedDeveloper,
            };
          })
        );

        // Sort the processed data
        const sortedData = processedData.sort((a, b) => {
          if (a.status === "Idle" && b.status !== "Idle") return 1;
          if (a.status !== "Idle" && b.status === "Idle") return -1;
          if (a.status === "Live" && b.status !== "Live") return -1;
          if (a.status !== "Live" && b.status === "Live") return 1;
          return a.title.localeCompare(b.title);
        });

        setProjectData(sortedData);
      }
    };
    fetchProjects();
  }, []);

  const handleStarClick = async (
    projectId: number,
    currentStars: number,
    currentVotes: string[]
  ) => {
    if (!userIP) return;

    const hasVoted = currentVotes.includes(userIP);
    const newVotes = hasVoted
      ? currentVotes.filter((ip) => ip !== userIP)
      : [...currentVotes, userIP];

    const newStars = hasVoted ? currentStars - 1 : currentStars + 1;

    const { error } = await supabase
      .from("decenter")
      .update({
        stars: newStars,
        star_votes: newVotes,
      })
      .eq("id", projectId);

    if (error) {
      console.error("Error updating stars:", error);
    } else {
      setProjectData((prevData) =>
        prevData.map((project) =>
          project.id === projectId
            ? { ...project, stars: newStars, star_votes: newVotes }
            : project
        )
      );
    }
  };

  // Update the filteredProjects logic to include search
  const filteredProjects = projectData
    .filter(
      (item) => activeCategory === "all" || item.category === activeCategory
    )
    .filter((item) =>
      searchQuery
        ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.matchedDeveloper &&
            item.matchedDeveloper.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
        : true
    )
    .sort((a, b) => {
      // First sort by status (Live > In Progress > Idle)
      if (a.status === "Idle" && b.status !== "Idle") return 1;
      if (a.status !== "Idle" && b.status === "Idle") return -1;
      if (a.status === "Live" && b.status !== "Live") return -1;
      if (a.status !== "Live" && b.status === "Live") return 1;

      // Then sort by the selected criteria
      switch (sortBy) {
        case "stars":
          return b.stars - a.stars;
        case "completion":
          return (
            new Date(a.estimated_completion).getTime() -
            new Date(b.estimated_completion).getTime()
          );
        default:
          return a.title.localeCompare(b.title);
      }
    });

  return (
    <Layout hideRightBar={true}>
      <NextSeo
        title="MultiversX Developer Tools | Build Better, Faster"
        description="Discover essential tools and frameworks for building on MultiversX. Find everything from smart contract libraries to frontend SDKs and more."
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

      <div className="container mx-auto">
        {/* Header section with slightly reduced padding */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary-dark/10 dark:to-primary-dark/20 rounded-2xl p-6 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-4xl font-bold text-theme-title dark:text-theme-title-dark mb-4 relative">
              MultiversX Dev Tools
              <div className="absolute w-14 h-0.5 bg-primary dark:bg-primary-dark left-1/2 transform -translate-x-1/2 bottom-0"></div>
            </h1>
            <p className="text-sm md:text-base text-theme-text dark:text-theme-text-dark max-w-3xl mx-auto">
              Discover the best tools, libraries, and frameworks for building on MultiversX. From smart contract development to frontend integration, find everything you need to accelerate your blockchain projects.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <div onClick={() => setShowSubmitForm(true)}>
              <Button
                label="Submit a Tool"
                icon={FiPlusCircle}
                class="text-sm py-2 px-4"
              />
            </div>
          </div>
        </div>

        {/* Compact filters section */}
        <div className="mb-5 bg-white dark:bg-secondary-dark rounded-xl shadow-lg p-3 border border-theme-border dark:border-theme-border-dark">
          <div className="flex flex-col md:flex-row justify-between items-center mb-3">
            <div className="mb-3 md:mb-0">
              <h2 className="text-base font-semibold text-theme-title dark:text-theme-title-dark flex items-center">
                <span className="mr-2">Tools Directory</span>
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
                  placeholder="Search tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-7 pr-7 py-1.5 text-xs rounded-md border border-theme-border dark:border-theme-border-dark bg-gray-50 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary-dark w-full md:w-auto"
                />
                <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-theme-text/50 dark:text-theme-text-dark/50 w-3 h-3" />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-theme-text/50 dark:text-theme-text-dark/50 hover:text-theme-text dark:hover:text-theme-text-dark"
                  >
                    <FiX size={12} />
                  </button>
                )}
              </div>

              {/* View mode toggle */}
              <div className="flex items-center text-xs font-medium">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-l-md ${
                    viewMode === "grid"
                      ? "bg-primary text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <FiGrid size={12} /> Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-r-md ${
                    viewMode === "list"
                      ? "bg-primary text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <FiList size={12} /> List
                </button>
              </div>

              {/* Sort selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-1.5 px-2 text-xs rounded-md border border-theme-border dark:border-theme-border-dark bg-gray-50 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary-dark"
              >
                <option value="title">Sort by Name</option>
                <option value="stars">Sort by Stars</option>
                <option value="completion">Sort by Completion</option>
              </select>

              {/* Filter toggle */}
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 ${
                  showFilters 
                    ? "bg-primary/10 text-primary dark:bg-primary-dark/10 dark:text-primary-dark" 
                    : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <FiSearch className={`w-3 h-3 ${showFilters ? "text-primary dark:text-primary-dark" : ""}`} />
                {showFilters ? "Hide Filters" : "More Filters"}
              </button>
            </div>
          </div>

          {/* Advanced filters panel */}
          {showFilters && (
            <div className="pt-2 border-t border-theme-border/30 dark:border-theme-border-dark/30">
              <div className="flex flex-wrap gap-2 mb-2">
                {/* Category filters */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {Array.from(new Set(projectData.map((item) => item.category)))
                    .filter((category) => category !== "Idle")
                    .map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                          activeCategory === category
                            ? "bg-primary text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                </div>

                {/* Reset filters button */}
                <button
                  onClick={() => {
                    setActiveCategory("all");
                    setSearchTerm("");
                    setSortBy("title");
                  }}
                  className="flex items-center gap-1 py-1 px-2 text-xs bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <FiRefreshCw size={10} />
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Project grid/list view with improved styling */}
        {selectedProject && (
          <RequestUpdate
            projectId={selectedProject.id.toString()}
            projectTitle={selectedProject.title}
            onClose={() => setSelectedProject(null)}
          />
        )}
        
        {filteredProjects.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 p-6 bg-gray-100 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50 max-w-3xl mx-auto">
            <p className="font-semibold text-sm mb-2">No tools found matching your criteria</p>
            <p className="text-xs mb-4">Try adjusting your search or browse all categories</p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setActiveCategory("all")}
                className="flex items-center gap-1 py-1.5 px-3 text-xs bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <FiSearch size={10} />
                Browse All Tools
              </button>
              <button 
                onClick={() => setShowSubmitForm(true)}
                className="flex items-center gap-1 py-1.5 px-3 text-xs bg-primary dark:bg-primary-dark text-white rounded-md hover:bg-primary-dark"
              >
                <FiPlusCircle size={10} />
                Submit a Tool
              </button>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-secondary-dark rounded-lg border border-theme-border dark:border-theme-border-dark shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-4">
                  {/* Status and Category Tags */}
                  <div className="flex justify-between items-start mb-2">
                    <CategoryBadge category={project.category} size="sm" />
                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      project.status === "Live"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                        : project.status === "Idle"
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                        : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    }`}>
                      {project.status}
                    </div>
                  </div>
                  
                  {/* Title and Stats */}
                  <div className="mb-2">
                    <h3 className="text-base font-semibold text-theme-title dark:text-theme-title-dark">{project.title}</h3>
                    <p className="text-xs text-theme-text/80 dark:text-theme-text-dark/80 mt-1 line-clamp-2">{project.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {project.github_stars !== undefined && (
                      <div className="flex items-center text-xs text-theme-text/70 dark:text-theme-text-dark/70">
                        <FiStar className="mr-1 text-amber-500 flex-shrink-0 w-3 h-3" />
                        <span>{project.github_stars.toLocaleString()}</span>
                      </div>
                    )}
                    {project.downloads !== undefined && (
                      <div className="flex items-center text-xs text-theme-text/70 dark:text-theme-text-dark/70">
                        <FiDownload className="mr-1 text-blue-500 flex-shrink-0 w-3 h-3" />
                        <span>{project.downloads.toLocaleString()}</span>
                      </div>
                    )}
                    {project.last_activity && (
                      <div className="flex items-center text-xs text-theme-text/70 dark:text-theme-text-dark/70">
                        <FiClock className="mr-1 text-green-500 flex-shrink-0 w-3 h-3" />
                        <span>{new Date(project.last_activity).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-3">
                    <div className="col-span-2">
                      <span className="text-xs font-medium text-theme-text/70 dark:text-theme-text-dark/70">
                        Team:
                      </span>
                      <span className="text-xs ml-1 text-theme-text dark:text-theme-text-dark">
                        {project.team}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs font-medium text-theme-text/70 dark:text-theme-text-dark/70">
                        Source:
                      </span>
                      <span className="text-xs ml-1 text-theme-text dark:text-theme-text-dark">
                        {project.open_source}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs font-medium text-theme-text/70 dark:text-theme-text-dark/70">
                        Assignees:
                      </span>
                      <span className="text-xs ml-1 text-theme-text dark:text-theme-text-dark">
                        {project.matchedDeveloper ? (
                          <a
                            href={project.matchedDeveloper.profileUrl}
                            className="text-primary dark:text-primary-dark hover:underline"
                          >
                            {project.matchedDeveloper.name}
                          </a>
                        ) : (
                          project.assignees || "None"
                        )}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs font-medium text-theme-text/70 dark:text-theme-text-dark/70">
                        Est. Completion:
                      </span>
                      <span className="text-xs ml-1 text-theme-text dark:text-theme-text-dark">
                        {project.estimated_completion}
                      </span>
                    </div>
                  </div>
                  
                  {/* Links and Actions */}
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center text-xs"
                        >
                          <FaLink className="mr-1 w-3 h-3" />
                          Website
                        </a>
                      )}
                      {project.documentation_url && (
                        <a
                          href={project.documentation_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center text-xs"
                        >
                          <FiBook className="mr-1 w-3 h-3" />
                          Docs
                        </a>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleStarClick(project.id, project.stars, project.star_votes)}
                      className={`flex items-center text-xs rounded-full px-2 py-1 ${
                        userIP && project.star_votes.includes(userIP)
                          ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                          : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      <FiStar className={`mr-1 w-3 h-3 ${userIP && project.star_votes.includes(userIP) ? "text-amber-500" : ""}`} />
                      {project.stars}
                    </button>
                  </div>
                  
                  {project.status === "Idle" && (
                    <div className="mt-3 text-center">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        Request Update
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 mb-8">
            {filteredProjects.map((project) => (
              <div 
                key={project.id}
                className="bg-white dark:bg-secondary-dark rounded-lg border border-theme-border dark:border-theme-border-dark shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 p-4"
              >
                <div className="flex items-start gap-4">
                  {/* Title and Category */}
                  <div className="flex-grow">
                    <div className="flex flex-wrap justify-between items-start mb-2">
                      <div>
                        <h3 className="text-base font-semibold text-theme-title dark:text-theme-title-dark">{project.title}</h3>
                        <div className="flex items-center mt-1">
                          <CategoryBadge category={project.category} size="sm" />
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                            project.status === "Live"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                              : project.status === "Idle"
                              ? "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                              : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          }`}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {project.github_stars !== undefined && (
                          <div className="flex items-center text-xs text-theme-text/70 dark:text-theme-text-dark/70">
                            <FiStar className="mr-1 text-amber-500 flex-shrink-0 w-3 h-3" />
                            <span>{project.github_stars.toLocaleString()}</span>
                          </div>
                        )}
                        {project.downloads !== undefined && (
                          <div className="flex items-center text-xs text-theme-text/70 dark:text-theme-text-dark/70 ml-3">
                            <FiDownload className="mr-1 text-blue-500 flex-shrink-0 w-3 h-3" />
                            <span>{project.downloads.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs text-theme-text/80 dark:text-theme-text-dark/80 mb-2 line-clamp-2">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-1 mb-2">
                      <div className="flex items-center">
                        <span className="text-xs font-medium text-theme-text/70 dark:text-theme-text-dark/70">
                          Team:
                        </span>
                        <span className="text-xs ml-1 text-theme-text dark:text-theme-text-dark">
                          {project.team}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs font-medium text-theme-text/70 dark:text-theme-text-dark/70">
                          Source:
                        </span>
                        <span className="text-xs ml-1 text-theme-text dark:text-theme-text-dark">
                          {project.open_source}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs font-medium text-theme-text/70 dark:text-theme-text-dark/70">
                          Assignees:
                        </span>
                        <span className="text-xs ml-1 text-theme-text dark:text-theme-text-dark">
                          {project.matchedDeveloper ? (
                            <a
                              href={project.matchedDeveloper.profileUrl}
                              className="text-primary dark:text-primary-dark hover:underline"
                            >
                              {project.matchedDeveloper.name}
                            </a>
                          ) : (
                            project.assignees || "None"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs font-medium text-theme-text/70 dark:text-theme-text-dark/70">
                          Est. Completion:
                        </span>
                        <span className="text-xs ml-1 text-theme-text dark:text-theme-text-dark">
                          {project.estimated_completion}
                        </span>
                      </div>
                      {project.last_activity && (
                        <div className="flex items-center">
                          <span className="text-xs font-medium text-theme-text/70 dark:text-theme-text-dark/70">
                            Last Activity:
                          </span>
                          <span className="text-xs ml-1 text-theme-text dark:text-theme-text-dark">
                            {new Date(project.last_activity).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions column */}
                  <div className="flex-shrink-0 flex flex-col gap-2 items-end">
                    <button
                      onClick={() => handleStarClick(project.id, project.stars, project.star_votes)}
                      className={`flex items-center text-xs rounded-full px-2 py-1 ${
                        userIP && project.star_votes.includes(userIP)
                          ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                          : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      <FiStar className={`mr-1 w-3 h-3 ${userIP && project.star_votes.includes(userIP) ? "text-amber-500" : ""}`} />
                      {project.stars}
                    </button>
                    
                    <div className="flex gap-2 mt-1">
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center text-xs"
                        >
                          <FaLink className="mr-1 w-3 h-3" />
                          Website
                        </a>
                      )}
                      {project.documentation_url && (
                        <a
                          href={project.documentation_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center text-xs"
                        >
                          <FiBook className="mr-1 w-3 h-3" />
                          Docs
                        </a>
                      )}
                    </div>
                    
                    {project.status === "Idle" && (
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="mt-1 text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        Request Update
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showSubmitForm && (
        <SubmitDecenter onClose={() => setShowSubmitForm(false)} />
      )}
    </Layout>
  );
}
