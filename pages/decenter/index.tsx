import { NextSeo } from "next-seo";
import Layout from "../../components/Layout";
import { FiLink } from "react-icons/fi";
import Button from "../../components/shared/Button";
import CategoryBadge from "../../components/shared/CategoryBadge";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { stat } from "fs";

// Interface for the project data structure
interface ProjectItem {
  title: string;
  assignees: string | null;
  status: string;
  open_source: string;
  estimated_completion: string;
  category: string;
  team: string;
  link: string | null;
}

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function DecenterPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [projectData, setProjectData] = useState<ProjectItem[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const today = new Date().toISOString();

      const { data, error } = await supabase
        .from("decenter")
        .select("*")
        .lte("publish_date", today) // Only get profiles with publish_date <= current date
        .not("publish_date", "is", null) // Exclude unpublished profiles
        .order("status", { ascending: true });
      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        setProjectData(data);
      }
    };
    fetchProjects();
  }, []);

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
            ecosystem. Everyone can contribute to the projects listed below or
            submit their own projects for review.
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
                          {item.assignees || "None"}
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
            Want to contribute? Submit your project to the MultiversX DeCenter
            open-source community!
          </p>
          <a
            href="https://forms.gle/WbywYMjCqbuhKfsVA"
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
