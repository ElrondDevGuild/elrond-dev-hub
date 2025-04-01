import { NextSeo } from "next-seo";
import Layout from "../../components/Layout";
import { FiLink, FiGift, FiCode } from "react-icons/fi";
import Button from "../../components/shared/Button";
import CategoryBadge from "../../components/shared/CategoryBadge";
import { useState } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { GetServerSideProps } from "next";
import SubmitBounty from "../../components/forms/SubmitBounty";

// Interface for the bounty data structure
interface BountyItem {
  id: string;
  title: string;
  description: string;
  status: string;
  bounty_amount: string | null;
  estimated_duration: string;
  category: string;
  difficulty_level: string;
  link: string | null;
  company_name: string;
  company_website: string;
  requirements: string[];
  skills_needed: string[];
  deadline: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface BountyPageProps {
  bountyData: BountyItem[];
}

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Add sorting options
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "highest_amount", label: "Highest Amount" },
  { value: "lowest_amount", label: "Lowest Amount" },
];

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Fetch only published bounties
    const { data, error } = await supabase
      .from("x_bounties")
      .select("*")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error fetching data from Supabase:", error);
      return {
        props: {
          bountyData: [],
        },
      };
    }

    return {
      props: {
        bountyData: data || [],
      },
    };
  } catch (err) {
    console.error("Error in getServerSideProps:", err);
    return {
      props: {
        bountyData: [],
      },
    };
  }
};

export default function BountyPage({ bountyData }: BountyPageProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeDifficulty, setActiveDifficulty] = useState("all");
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(false);

  // Ensure bountyData is defined
  const validBountyData = bountyData || [];

  // Sort bounties based on selected option
  const sortedBounties = [...validBountyData].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.published_at!).getTime() -
          new Date(a.published_at!).getTime()
        );
      case "oldest":
        return (
          new Date(a.published_at!).getTime() -
          new Date(b.published_at!).getTime()
        );
      case "highest_amount":
        return (
          parseFloat(b.bounty_amount || "0") -
          parseFloat(a.bounty_amount || "0")
        );
      case "lowest_amount":
        return (
          parseFloat(a.bounty_amount || "0") -
          parseFloat(b.bounty_amount || "0")
        );
      default:
        return 0;
    }
  });

  // Filter bounties based on the activeCategory and activeDifficulty values
  const filteredBounties = sortedBounties
    .filter(
      (item) => activeCategory === "all" || item.category === activeCategory
    )
    .filter(
      (item) =>
        activeDifficulty === "all" || item.difficulty_level === activeDifficulty
    );

  // Get unique categories and difficulty levels for filter buttons
  const categories = Array.from(
    new Set(validBountyData.map((item) => item.category))
  );
  const difficultyLevels = Array.from(
    new Set(validBountyData.map((item) => item.difficulty_level))
  );

  return (
    <Layout hideRightBar>
      <NextSeo
        title="MultiversX Bounty Board - Find Development Opportunities"
        description="Browse and apply for development bounties from MultiversX ecosystem projects. Connect with companies and earn rewards for your skills."
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
            Development Bounty Board
          </h1>
          <p className="text-md md:text-lg text-theme-text dark:text-theme-text-dark max-w-3xl mx-auto pb-4 !overflow-visible">
            <Image
              src={"/multiversx/x-mint.svg"}
              height={20}
              width={20}
              className=""
            ></Image>{" "}
            Discover development opportunities from MultiversX ecosystem
            projects. Browse bounties, apply for projects, or
            <span className="bg-primary/10 dark:bg-primary-dark/10 px-2 py-1 rounded-md text-primary dark:text-primary-dark">
              list your own bounties to find talented developers.
            </span>
          </p>
        </div>

        {validBountyData.length > 0 && (
          <div className="flex flex-col space-y-4 items-center mb-8">
            <div className="w-full max-w-4xl">
              <div className="flex flex-wrap justify-center gap-3 mb-0">
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

            <div className="w-full max-w-4xl">
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
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {validBountyData.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="bg-secondary dark:bg-secondary-dark rounded-xl p-8 max-w-2xl mx-auto">
                <FiGift className="w-16 h-16 mx-auto mb-4 text-theme-text/40 dark:text-theme-text-dark/40" />
                <h3 className="text-xl font-bold text-theme-title dark:text-theme-title-dark mb-2">
                  No Bounties Available
                </h3>
                <p className="text-theme-text dark:text-theme-text-dark mb-6">
                  There are currently no active bounties. Check back later or
                  submit your own bounty to get started!
                </p>
                <button
                  onClick={() => setShowSubmitForm(true)}
                  className="inline-flex items-center bg-primary text-white font-semibold py-3 px-6 rounded-full hover:bg-primary-dark dark:bg-primary-dark dark:hover:bg-primary transition-colors duration-200"
                >
                  Submit a Bounty <FiLink className="ml-2" />
                </button>
              </div>
            </div>
          ) : filteredBounties.length > 0 ? (
            filteredBounties.map((item, index) => (
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

                  <div className="mb-2">
                    <span className="text-sm text-theme-text/60 dark:text-theme-text-dark/60">
                      Posted by{" "}
                      <a
                        href={item.company_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary dark:text-primary-dark hover:underline"
                      >
                        {item.company_name}
                      </a>
                    </span>
                  </div>

                  <p className="text-sm text-theme-text dark:text-theme-text-dark mb-4 line-clamp-3">
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
                    {item.deadline && (
                      <div className="flex text-sm">
                        <div className="mr-1 text-theme-text/60 dark:text-theme-text-dark/60">
                          Deadline:
                        </div>
                        <div className="font-medium text-theme-text dark:text-theme-text-dark">
                          {new Date(item.deadline).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.skills_needed.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-full text-theme-text dark:text-theme-text-dark"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between mt-auto z-10">
                    <Button label="Apply for Bounty" href={item.link || "#"} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="bg-secondary dark:bg-secondary-dark rounded-xl p-8 max-w-2xl mx-auto">
                <FiCode className="w-16 h-16 mx-auto mb-4 text-theme-text/40 dark:text-theme-text-dark/40" />
                <h3 className="text-xl font-bold text-theme-title dark:text-theme-title-dark mb-2">
                  No Matching Bounties
                </h3>
                <p className="text-theme-text dark:text-theme-text-dark mb-6">
                  No bounties match your current filters. Try adjusting your
                  category or difficulty filters to see more results.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setActiveCategory("all");
                      setActiveDifficulty("all");
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary dark:bg-primary-dark rounded-md hover:bg-primary-dark dark:hover:bg-primary transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={() => setShowSubmitForm(true)}
                    className="px-4 py-2 text-sm font-medium text-theme-text dark:text-theme-text-dark bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    Submit a Bounty
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {validBountyData.length > 0 && (
          <div className="text-center mt-16 bg-secondary dark:bg-secondary-dark rounded-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-theme-title dark:text-theme-title-dark mb-4">
              Have a Bounty to List?
            </h2>
            <p className="text-theme-text dark:text-theme-text-dark mb-6 max-w-2xl mx-auto">
              If you're a company or project looking to hire developers, submit
              your bounty to reach our community of talented MultiversX
              developers.
            </p>
            <button
              onClick={() => setShowSubmitForm(true)}
              className="inline-flex items-center bg-primary text-white font-semibold py-3 px-6 rounded-full hover:bg-primary-dark dark:bg-primary-dark dark:hover:bg-primary transition-colors duration-200"
            >
              List a Bounty <FiLink className="ml-2" />
            </button>
          </div>
        )}
      </section>

      {showSubmitForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <SubmitBounty onClose={() => setShowSubmitForm(false)} />
        </div>
      )}
    </Layout>
  );
}
