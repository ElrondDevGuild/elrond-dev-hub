import { NextSeo } from "next-seo";
import Layout from "../../components/Layout";
import { FiLink, FiGift, FiCode, FiFilter, FiArrowUp, FiSearch, FiGrid, FiList, FiX, FiRefreshCw } from "react-icons/fi";
import Button from "../../components/shared/Button";
import CategoryBadge from "../../components/shared/CategoryBadge";
import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { GetServerSideProps } from "next";
import SubmitBounty from "../../components/forms/SubmitBounty";
import BountyCard from "../../components/bounties/BountyCard";
import BountyProcessExplainer from "../../components/bounties/BountyProcessExplainer";
import Link from "next/link";

// Interface for the bounty data structure
interface BountyItem {
  id: string;
  title: string;
  description: string;
  status: string;
  bounty_amount: string | null;
  token_type?: string;
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
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatuses, setActiveStatuses] = useState<string[]>([]);

  // Ensure bountyData is defined
  const validBountyData = bountyData || [];

  // Get unique categories, difficulty levels, and statuses
  const categories = Array.from(
    new Set(validBountyData.map((item) => item.category))
  );
  const difficultyLevels = Array.from(
    new Set(validBountyData.map((item) => item.difficulty_level))
  );
  const statuses = Array.from(
    new Set(validBountyData.map((item) => item.status))
  );

  // Filter bounties based on all criteria
  const filteredBounties = [...validBountyData]
    .filter(
      (item) => activeCategory === "all" || item.category === activeCategory
    )
    .filter(
      (item) =>
        activeDifficulty === "all" || item.difficulty_level === activeDifficulty
    )
    .filter(item => 
      activeStatuses.length === 0 || activeStatuses.includes(item.status)
    )
    .filter(item => 
      !searchTerm || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Sort bounties based on selected option
  const sortedBounties = [...filteredBounties].sort((a, b) => {
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

  // Handle sorting change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  // Toggle status filter
  const toggleStatus = (status: string) => {
    setActiveStatuses(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setActiveCategory("all");
    setActiveDifficulty("all");
    setActiveStatuses([]);
    setSearchTerm("");
    setSortBy("newest");
  };

  // Get status color class
  const getStatusClass = (status: string) => {
    switch(status) {
      case "Open": return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      case "Pending": return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      case "Closed": return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      default: return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Layout hideRightBar={true}>
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
        {/* Page Header - more compact */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary-dark/10 dark:to-primary-dark/20 rounded-2xl p-6 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-4xl font-bold text-theme-title dark:text-theme-title-dark mb-4 relative">
              MultiversX Bounty Board
              <div className="absolute w-14 h-0.5 bg-primary dark:bg-primary-dark left-1/2 transform -translate-x-1/2 bottom-0"></div>
            </h1>
            <p className="text-sm md:text-base text-theme-text dark:text-theme-text-dark max-w-3xl mx-auto">
              Find development opportunities, solve technical challenges, and earn rewards by 
              working on bounties posted by companies in the MultiversX ecosystem.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <div onClick={() => setShowSubmitForm(true)}>
              <Button
                label="Submit a Bounty"
                icon={FiGift}
                class="text-sm py-2 px-4"
              />
            </div>
            <Link href="#process">
              <a>
                <Button
                  label="How It Works"
                  icon={FiLink}
                  theme="secondary"
                  class="text-sm py-2 px-4"
                />
              </a>
            </Link>
          </div>
        </div>

        {/* Compact Filters Section */}
        <div className="mb-5 bg-white dark:bg-secondary-dark rounded-xl shadow-lg p-3 border border-theme-border dark:border-theme-border-dark">
          <div className="flex flex-col md:flex-row justify-between items-center mb-3">
            <div className="mb-3 md:mb-0">
              <h2 className="text-base font-semibold text-theme-title dark:text-theme-title-dark flex items-center">
                <span className="mr-2">Bounties</span>
                {filteredBounties.length > 0 && (
                  <span className="text-xs font-normal text-theme-text/60 dark:text-theme-text-dark/60">
                    ({filteredBounties.length} found)
                  </span>
                )}
              </h2>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {/* Search box */}
              <div className="relative w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search bounties..."
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

              {/* Sort selector */}
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="py-1.5 px-2 text-xs rounded-md border border-theme-border dark:border-theme-border-dark bg-gray-50 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary-dark"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

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

          {/* Advanced filters panel */}
          {showFilters && (
            <div className="pt-2 border-t border-theme-border/30 dark:border-theme-border-dark/30">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-2">
                {/* Category filter */}
                <div className="md:col-span-4">
                  <label className="block text-xs font-medium text-theme-text dark:text-theme-text-dark mb-1">Category</label>
                  <div className="flex flex-wrap gap-1">
                    <button
                      onClick={() => setActiveCategory("all")}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                        activeCategory === "all"
                          ? "bg-primary text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      All
                    </button>
                    {categories.map((category) => (
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
                </div>

                {/* Status filter */}
                <div className="md:col-span-4">
                  <label className="block text-xs font-medium text-theme-text dark:text-theme-text-dark mb-1">Status</label>
                  <div className="flex flex-wrap gap-1">
                    {statuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => toggleStatus(status)}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                          activeStatuses.includes(status)
                            ? getStatusClass(status)
                            : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty level filter */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-theme-text dark:text-theme-text-dark mb-1">Difficulty</label>
                  <div className="flex flex-wrap gap-1">
                    <button
                      onClick={() => setActiveDifficulty("all")}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                        activeDifficulty === "all"
                          ? "bg-primary text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      All
                    </button>
                    {difficultyLevels.map((level) => (
                      <button
                        key={level}
                        onClick={() => setActiveDifficulty(level)}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                          activeDifficulty === level
                            ? "bg-primary text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
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

        {/* Bounties list - better spacing */}
        {sortedBounties.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 p-6 bg-gray-100 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50 max-w-3xl mx-auto mb-8">
            <p className="font-semibold text-sm mb-2">No bounties match your search criteria.</p>
            <p className="text-xs">Try adjusting your filters or checking back later for new opportunities.</p>
          </div>
        ) : (
          <div className={`grid gap-4 mb-8 ${
            viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          }`}>
            {sortedBounties.map((bounty) => (
              <BountyCard 
                key={bounty.id} 
                bounty={bounty} 
                viewMode={viewMode}
              />
            ))}
          </div>
        )}

        {/* How it works section */}
        <div id="process" className="max-w-5xl mx-auto mb-8 scroll-mt-8">
          <BountyProcessExplainer />
        </div>
      </section>

      {showSubmitForm && (
        <SubmitBounty onClose={() => setShowSubmitForm(false)} />
      )}
    </Layout>
  );
}
