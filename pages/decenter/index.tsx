import { NextSeo } from "next-seo";
import Layout from "../../components/Layout";
import { FiLink, FiStar, FiClock, FiDownload, FiBook } from "react-icons/fi";
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
            ecosystem. Everyone can contribute to the projects listed below or
            submit their own projects for review.
          </p>
        </div>

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

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
          <div className="w-full max-w-sm">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-full border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          >
            <option value="title">Sort by Title</option>
            <option value="stars">Sort by Stars</option>
            <option value="completion">Sort by Completion Date</option>
          </select>
        </div>

        {selectedProject && (
          <RequestUpdate
            projectId={selectedProject.id.toString()}
            projectTitle={selectedProject.title}
            onClose={() => setSelectedProject(null)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((item, index) => (
              <div
                key={index}
                className={`bg-secondary dark:bg-secondary-dark rounded-xl shadow-lg p-6 border border-theme-border/30 dark:border-theme-border-dark/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
                  item.status === "Idle" ? "opacity-50" : ""
                }`}
              >
                <div
                  className={`absolute top-0 left-0 w-full h-1 ${
                    item.status === "Live"
                      ? "bg-green-500"
                      : item.status === "Idle"
                      ? "bg-gray-500"
                      : "bg-blue-500"
                  }`}
                ></div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                <div className="relative">
                  <div className="flex justify-between items-start mb-4">
                    <CategoryBadge
                      size="sm"
                      category={item.category}
                      className="z-10 max-w-[150px] truncate"
                    />
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.status === "Live"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : item.status === "Idle"
                          ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-theme-title dark:text-theme-title-dark mb-2 group-hover:text-primary dark:group-hover:text-primary-dark transition-colors duration-200 relative">
                  {item.title}
                </h2>

                {/* Add project description */}
                {item.description && (
                  <p className="text-sm text-theme-text/80 dark:text-theme-text-dark/80 mb-3 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {/* Add project metrics */}
                <div className="flex items-center space-x-4 text-sm text-theme-text/60 dark:text-theme-text-dark/60 mb-3">
                  {item.last_activity && (
                    <span className="flex items-center">
                      <FiClock className="w-4 h-4 mr-1" />
                      Last Activity:{" "}
                      {new Date(item.last_activity).toLocaleDateString()}
                    </span>
                  )}
                  {item.github_stars && (
                    <span className="flex items-center">
                      <FiStar className="w-4 h-4 mr-1" />
                      {item.github_stars}
                    </span>
                  )}
                  {item.downloads && (
                    <span className="flex items-center">
                      <FiDownload className="w-4 h-4 mr-1" />
                      {item.downloads}
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex text-sm">
                    <div className="mr-1 text-theme-text/60 dark:text-theme-text-dark/60">
                      Team:
                    </div>
                    <div className="font-medium text-theme-text dark:text-theme-text-dark">
                      {item.team}
                    </div>
                  </div>
                  <div className="flex text-sm">
                    <div className="mr-1 text-theme-text/60 dark:text-theme-text-dark/60">
                      Source:
                    </div>
                    <div className="font-medium text-theme-text dark:text-theme-text-dark">
                      {item.open_source}
                    </div>
                  </div>
                  <div className="flex text-sm">
                    <div className="mr-1 text-theme-text/60 dark:text-theme-text-dark/60">
                      Assignees:
                    </div>
                    <div className="font-medium text-theme-text dark:text-theme-text-dark">
                      {item.matchedDeveloper ? (
                        <a
                          href={item.matchedDeveloper.profileUrl}
                          className="text-primary hover:text-primary-dark dark:text-primary-dark dark:hover:text-primary transition-colors duration-200"
                        >
                          {item.matchedDeveloper.name}
                        </a>
                      ) : (
                        item.assignees || "None"
                      )}
                    </div>
                  </div>
                  <div className="flex text-sm">
                    <div className="mr-1 text-theme-text/60 dark:text-theme-text-dark/60">
                      Est. Completion:
                    </div>
                    <div className="font-medium text-theme-text dark:text-theme-text-dark">
                      {item.estimated_completion}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 z-30">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        handleStarClick(item.id, item.stars, item.star_votes)
                      }
                      className={`flex items-center space-x-1 px-3 py-2 rounded-full transition-colors duration-200 ${
                        item.star_votes.includes(userIP || "")
                          ? "text-yellow-500"
                          : "text-gray-500 hover:text-yellow-500"
                      }`}
                    >
                      <FiStar className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.stars}</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      label="Contribute"
                      href="https://github.com/multiversx"
                    />
                    {item.documentation_url && (
                      <a
                        href={item.documentation_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-full bg-gray-100 hover:bg-primary/10 dark:bg-gray-800 dark:hover:bg-primary-dark/20 text-theme-text dark:text-theme-text-dark hover:text-primary dark:hover:text-primary-dark transition-colors duration-200"
                        title="View documentation"
                      >
                        <FiBook className="w-4 h-4" />
                      </a>
                    )}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-3 rounded-full bg-gray-100 hover:bg-primary/10 dark:bg-gray-800 dark:hover:bg-primary-dark/20 text-theme-text dark:text-theme-text-dark hover:text-primary dark:hover:text-primary-dark transition-colors duration-200"
                        title="Visit project"
                      >
                        <FaLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex justify-center space-x-2 pt-4 z-30">
                  {item.status === "Idle" && (
                    <button
                      onClick={() => setSelectedProject(item)}
                      className="px-3 py-2 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors duration-200 text-sm font-medium flex items-center"
                      title="Request project update"
                    >
                      Request Update
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-theme-text dark:text-theme-text-dark">
              No projects found at this time.
            </p>
          )}
        </div>
        <div className="text-center mt-12">
          <p className="text-theme-text dark:text-theme-text-dark mb-4">
            Want to contribute? Submit your project to the MultiversX DeCenter
            open-source community!
          </p>
          <button
            onClick={() => setShowSubmitForm(true)}
            className="inline-block bg-primary text-white font-semibold py-3 px-6 rounded-full hover:bg-primary-dark dark:bg-primary-dark dark:hover:bg-primary transition-colors duration-200"
          >
            Submit Project <FiLink className="inline-block ml-2" />
          </button>
        </div>
      </section>

      {showSubmitForm && (
        <SubmitDecenter onClose={() => setShowSubmitForm(false)} />
      )}
    </Layout>
  );
}
