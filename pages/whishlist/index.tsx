import { NextSeo } from "next-seo";
import Layout from "../../components/Layout";
import { FiLink, FiGift, FiCode } from "react-icons/fi";
import Button from "../../components/shared/Button";
import CategoryBadge from "../../components/shared/CategoryBadge";
import { useState } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { GetServerSideProps } from "next";

// Interface for the project data structure
interface ProjectItem {
  title: string;
  description: string;
  status: string;
  bounty_amount: string | null;
  estimated_duration: string;
  category: string;
  difficulty_level: string;
  link: string | null;
  priority: "High" | "Medium" | "Low";
}

interface WishlistPageProps {
  wishlistData: ProjectItem[];
}

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Fetch data from Supabase
    const { data, error } = await supabase.from("wishlist").select("*");

    if (error) {
      console.error("Error fetching data from Supabase:", error);
      return {
        props: {
          wishlistData: [],
        },
      };
    }

    return {
      props: {
        wishlistData: data || [],
      },
    };
  } catch (err) {
    console.error("Error in getServerSideProps:", err);
    return {
      props: {
        wishlistData: [],
      },
    };
  }
};

export default function WishlistPage({ wishlistData }: WishlistPageProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeDifficulty, setActiveDifficulty] = useState("all");

  // Ensure wishlistData is defined
  const validWishlistData = wishlistData || [];

  // Filter projects based on the activeCategory and activeDifficulty values
  const filteredProjects = validWishlistData
    .filter(
      (item) => activeCategory === "all" || item.category === activeCategory
    )
    .filter(
      (item) =>
        activeDifficulty === "all" || item.difficulty_level === activeDifficulty
    );

  // Get unique categories and difficulty levels for filter buttons
  const categories = Array.from(
    new Set(validWishlistData.map((item) => item.category))
  );
  const difficultyLevels = Array.from(
    new Set(validWishlistData.map((item) => item.difficulty_level))
  );

  return (
    <Layout hideRightBar>
      <NextSeo
        title="MultiversX Development Wishlist - Dev Grants & Bounties"
        description="Explore MultiversX foundation-curated list of desired development projects to be incentivized by dev grants and bounties."
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
            Development Wishlist
          </h1>
          <p className="text-md md:text-lg text-theme-text dark:text-theme-text-dark max-w-2xl mx-auto pb-4 !overflow-visible">
            <Image
              src={"/multiversx/x-mint.svg"}
              height={20}
              width={20}
              className=""
            ></Image>{" "}
            MultiversX Foundation-curated list of desired development projects
            with potential grants and bounties. Apply for a project or submit a
            proposal for your own idea.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col space-y-4 items-center">
            <div className="w-full max-w-4xl">
              {/* <h3 className="text-sm font-medium text-theme-text/70 dark:text-theme-text-dark/70 mb-2 text-center">
                Filter by Category
              </h3> */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-colors duration-200 ${
                    activeCategory === "all"
                      ? "bg-primary text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-theme-text dark:text-theme-text-dark hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
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
                ))}
              </div>
            </div>

            {/* <div className="w-full max-w-4xl">
              <h3 className="text-sm font-medium text-theme-text/70 dark:text-theme-text-dark/70 mb-2 text-center">
                Filter by Difficulty
              </h3>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <button
                  onClick={() => setActiveDifficulty("all")}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-colors duration-200 ${
                    activeDifficulty === "all"
                      ? "bg-primary text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-theme-text dark:text-theme-text-dark hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  All Difficulties
                </button>
                {difficultyLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setActiveDifficulty(level)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-colors duration-200 ${
                      activeDifficulty === level
                        ? "bg-primary text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-theme-text dark:text-theme-text-dark hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div> */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((item, index) => (
              <div
                key={index}
                className="bg-secondary dark:bg-secondary-dark rounded-xl shadow-lg p-6 border border-theme-border/30 dark:border-theme-border-dark/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Priority indicator */}
                <div
                  className={`absolute top-0 left-0 w-full h-1 ${
                    item.difficulty_level === "Hard"
                      ? "bg-red-500"
                      : item.difficulty_level === "Medium"
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                  }`}
                ></div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative">
                  <div className="flex justify-between items-start mb-4">
                    <CategoryBadge
                      size="sm"
                      category={
                        item.category && item.category.length > 16
                          ? `${item.category.slice(0, 16)}...`
                          : item.category || "Unknown"
                      }
                      className="z-10 max-w-[150px] truncate"
                    />
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.status === "Open for Applications"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-theme-title dark:text-theme-title-dark mb-2 group-hover:text-primary dark:group-hover:text-primary-dark transition-colors duration-200">
                    {item.title}
                  </h2>

                  <p className="text-sm text-theme-text dark:text-theme-text-dark mb-4">
                    {item.description}
                  </p>

                  <div className="space-y-1 mb-6">
                    <div className="flex text-sm">
                      <div className="mr-1 text-theme-text/60 dark:text-theme-text-dark/60 flex items-center">
                        <FiGift className="mr-1" /> Bounty:
                      </div>
                      <div className="font-medium text-theme-text dark:text-theme-text-dark">
                        {item.bounty_amount}
                      </div>
                    </div>
                    <div className="flex text-sm">
                      <div className="mr-1 text-theme-text/60 dark:text-theme-text-dark/60 flex items-center">
                        <FiCode className="mr-1" /> Difficulty:
                      </div>
                      <div className="font-medium text-theme-text dark:text-theme-text-dark">
                        {item.difficulty_level}
                      </div>
                    </div>
                    <div className="flex text-sm">
                      <div className="mr-1 text-theme-text/60 dark:text-theme-text-dark/60">
                        Est. Duration:
                      </div>
                      <div className="font-medium text-theme-text dark:text-theme-text-dark">
                        {item.estimated_duration}
                      </div>
                    </div>
                    <div className="flex text-sm">
                      <div className="mr-1 text-theme-text/60 dark:text-theme-text-dark/60">
                        Priority:
                      </div>
                      <div
                        className={`font-medium ${
                          item.priority === "High"
                            ? "text-red-500 dark:text-red-400"
                            : item.priority === "Medium"
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-blue-500 dark:text-blue-400"
                        }`}
                      >
                        {item.priority}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-auto z-10">
                    <Button
                      label="Apply for Grant"
                      href="https://github.com/multiversx/mx-grants"
                    />
                    {/* {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-3 rounded-full bg-gray-100 hover:bg-primary/10 dark:bg-gray-800 dark:hover:bg-primary-dark/20 text-theme-text dark:text-theme-text-dark hover:text-primary dark:hover:text-primary-dark transition-colors duration-200"
                        title="View project details"
                      >
                        <FiLink className="w-4 h-4" />
                      </a>
                    )} */}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-theme-text dark:text-theme-text-dark py-8">
              {validWishlistData.length === 0
                ? "Loading projects..."
                : "No projects found matching your filters or available right now."}
            </p>
          )}
        </div>

        <div className="text-center mt-16 bg-secondary dark:bg-secondary-dark rounded-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-theme-title dark:text-theme-title-dark mb-4">
            Have a Development Idea?
          </h2>
          <p className="text-theme-text dark:text-theme-text-dark mb-6 max-w-2xl mx-auto">
            If you have a proposal for a project that could benefit the
            MultiversX ecosystem, submit your idea for consideration by the
            foundation for potential grants.
          </p>
          <a
            href="https://forms.gle/Nhnoef48MBpEv9f57"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-white font-semibold py-3 px-6 rounded-full hover:bg-primary-dark dark:bg-primary-dark dark:hover:bg-primary transition-colors duration-200"
          >
            Submit a Proposal <FiLink className="inline-block ml-2" />
          </a>
        </div>
      </section>
    </Layout>
  );
}
