import { NextSeo } from "next-seo";
import Layout from "../../components/Layout";
import { FiLink, FiGift, FiCode, FiFilter, FiArrowUp, FiSearch, FiGrid, FiList, FiX, FiRefreshCw, FiBriefcase, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import Button from "../../components/shared/Button";
import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { GetServerSideProps } from "next";
import SubmitBounty from "../../components/forms/SubmitBounty";
import BountyCard from "../../components/bounties/BountyCard";
import BountyProcessExplainer from "../../components/bounties/BountyProcessExplainer";
import Link from "next/link";

// Interface for the PeerMe bounty data structure
interface PeerMeBounty {
  id: string;
  chainId: number;
  entity: {
    id: string;
    name: string;
    slug: string;
    address: string;
    avatarUrl: string;
    description: string;
    verified: boolean;
  };
  title: string;
  description: string;
  deadlineAt: string | null;
  hasDeadlineEnded: boolean;
  competition: boolean;
  payments: Array<{
    tokenId: string;
    tokenNonce: string;
    tokenDecimals: number;
    tokenLogo: string;
    tokenName: string;
    amount: string;
  }>;
  target: {
    tokenId: string;
    tokenNonce: string;
    tokenDecimals: number;
    tokenLogo: string;
    tokenName: string;
    amount: string;
  };
  status: string;
  evaluating: boolean;
  private: boolean;
  createdAt: string;
  url: string;
  tags?: string[]; // Will need to be added or derived from the API response
}

interface BountyPageProps {
  bountyData: PeerMeBounty[];
  error?: string | null; // Allow null for no error
  apiStatus?: number | null; // To pass API status code if needed
}

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Add sorting options
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "highest_amount", label: "Highest Reward" },
  { value: "lowest_amount", label: "Lowest Reward" },
];

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const apiKey = process.env.PEERME_API_KEY;
    if (!apiKey) {
      console.error("PeerMe API key is not configured.");
      return {
        props: {
          bountyData: [],
          error: "Configuration error: PeerMe API key is not set.",
          apiStatus: null,
        },
      };
    }

    const peerMeOrgId = "xalliance";
    const response = await fetch(
      `https://api.peerme.io/v1/entities/${peerMeOrgId}/bounties`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error fetching data from PeerMe API:", response.status, errorText);
      // If entity not found (404) or other client/server error, pass this info to the page
      return {
        props: {
          bountyData: [],
          error: `Failed to fetch bounties. PeerMe API returned: ${response.status}. ${errorText}`,
          apiStatus: response.status,
        },
      };
    }

    const data = await response.json();
    // The PeerMe API returns a data array containing the bounties
    const bounties = data.data || [];

    return {
      props: {
        bountyData: bounties,
        error: null,
        apiStatus: response.status,
      },
    };
  } catch (err: any) {
    console.error("Network or other error in getServerSideProps (PeerMe):", err);
    return {
      props: {
        bountyData: [],
        error: `An unexpected error occurred: ${err.message}`,
        apiStatus: null,
      },
    };
  }
};

export default function BountyPage({ bountyData, error, apiStatus }: BountyPageProps) {
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatuses, setActiveStatuses] = useState<string[]>([]);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  const validBountyData = bountyData || [];

  // Filter out completed bounties older than 1 month
  const filteredByDate = validBountyData.filter(bounty => {
    // Filter out completed bounties older than 1 month
    if (bounty.status === "completed") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const bountyCreatedAt = new Date(bounty.createdAt);
      return bountyCreatedAt >= oneMonthAgo;
    }
    return true;
  });

  const allTags = Array.from(new Set(filteredByDate.flatMap((item) => item.tags || [])));
  const statuses = Array.from(new Set(filteredByDate.map((item) => item.status))) as PeerMeBounty['status'][];

  const filteredBounties = [...filteredByDate]
    .filter(item => activeTags.length === 0 || (item.tags && item.tags.some(tag => activeTags.includes(tag))))
    .filter(item => activeStatuses.length === 0 || activeStatuses.includes(item.status))
    .filter(item => 
      !searchTerm || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.entity && item.entity.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    .filter(item => !showOnlyAvailable || (item.status === "open" && !item.hasDeadlineEnded));

  const sortedBounties = [...filteredBounties].sort((a, b) => {
    switch (sortBy) {
      case "newest": return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      case "oldest": return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      case "highest_amount": {
        const getAmount = (bounty: PeerMeBounty) => {
          if (!bounty.payments || bounty.payments.length === 0) return 0;
          const payment = bounty.payments[0];
          return parseInt(payment.amount) / Math.pow(10, payment.tokenDecimals);
        };
        return getAmount(b) - getAmount(a);
      }
      case "lowest_amount": {
        const getAmount = (bounty: PeerMeBounty) => {
          if (!bounty.payments || bounty.payments.length === 0) return 0;
          const payment = bounty.payments[0];
          return parseInt(payment.amount) / Math.pow(10, payment.tokenDecimals);
        };
        return getAmount(a) - getAmount(b);
      }
      default: return 0;
    }
  });

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value);
  const toggleStatus = (status: PeerMeBounty['status']) => setActiveStatuses(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]);
  const toggleTag = (tag: string) => setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  const resetFilters = () => {
    setActiveTags([]);
    setActiveStatuses([]);
    setSearchTerm("");
    setSortBy("newest");
    setShowOnlyAvailable(false);
    setShowFilters(false);
  };

  const getStatusClass = (status: PeerMeBounty['status']) => {
    // Simplified from previous for brevity, can be expanded
    if (activeStatuses.includes(status)) {
        switch(status) {
            case "open": return "bg-green-500 text-white";
            case "in_progress": return "bg-blue-500 text-white";
            case "closed": return "bg-red-500 text-white";
            case "completed": return "bg-purple-500 text-white";
            default: return "bg-gray-500 text-white";
        }
    }
    return "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-theme-text dark:text-theme-text-dark";
  };
  
  const peerMeSubmitUrl = "https://peerme.io/quests/create?source=xdevhub"; // Placeholder - UPDATE THIS URL

  return (
    <Layout hideRightBar={true}>
      <NextSeo
        title="Bounties (with PeerMe) on MultiversX Dev Hub"
        description="Browse development bounties from PeerMe. Submissions handled on the PeerMe platform."
      />

      <section className="container mx-auto">
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary-dark/10 dark:to-primary-dark/20 rounded-2xl p-6 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-4xl font-bold text-theme-title dark:text-theme-title-dark mb-4 relative">
              Bounties (with PeerMe)
              <div className="absolute w-14 h-0.5 bg-primary dark:bg-primary-dark left-1/2 transform -translate-x-1/2 bottom-0"></div>
            </h1>
            <p className="text-sm md:text-base text-theme-text dark:text-theme-text-dark max-w-3xl mx-auto">
              Explore bounties sourced from the PeerMe platform. 
              Note: Applications and submissions are managed directly on PeerMe.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <Link href="#process-explainer">
              <a>
                <Button
                  label="How It Works"
                  icon={FiBriefcase}
                  theme="secondary"
                  class="text-sm py-2 px-4"
                />
              </a>
            </Link>
          </div>
        </div>
        
        {/* Filters Bar - aligned with toolindex style */}
        <div className="mb-5 bg-white dark:bg-secondary-dark rounded-xl shadow-lg p-3 border border-theme-border dark:border-theme-border-dark">
          <div className="flex flex-col md:flex-row justify-between items-center mb-3">
            <div className="mb-3 md:mb-0">
              <h2 className="text-base font-semibold text-theme-title dark:text-theme-title-dark flex items-center">
                <span className="mr-2">Bounties Directory</span>
                {sortedBounties.length > 0 && (
                  <span className="text-xs font-normal text-theme-text/60 dark:text-theme-text-dark/60">
                    ({sortedBounties.length} found)
                  </span>
                )}
              </h2>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {/* Available bounties toggle */}
              <button
                onClick={() => setShowOnlyAvailable(!showOnlyAvailable)}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 ${
                  showOnlyAvailable 
                    ? "bg-green-500 text-white" 
                    : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <FiCheckCircle className="w-3 h-3" />
                {showOnlyAvailable ? "Available Only" : "Show All"}
              </button>

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
                onChange={handleSortChange}
                className="py-1.5 px-2 text-xs rounded-md border border-theme-border dark:border-theme-border-dark bg-gray-50 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary-dark"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
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
                <FiFilter className={`w-3 h-3 ${showFilters ? "text-primary dark:text-primary-dark" : ""}`} />
                {showFilters ? "Hide Filters" : "More Filters"}
              </button>
            </div>
          </div>

          {/* Advanced filters panel */}
          {showFilters && (
            <div className="pt-2 border-t border-theme-border/30 dark:border-theme-border-dark/30">
              <div className="flex flex-wrap gap-2 mb-2">
                {/* Status filters */}
                {statuses.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1 mr-4">
                    <span className="text-xs font-medium text-theme-text/70 dark:text-theme-text-dark/70 mr-1 mt-0.5">Status:</span>
                    {statuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => toggleStatus(status)}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                          activeStatuses.includes(status)
                            ? "bg-primary text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Tags filters */}
                {allTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    <span className="text-xs font-medium text-theme-text/70 dark:text-theme-text-dark/70 mr-1 mt-0.5">Tags:</span>
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                          activeTags.includes(tag)
                            ? "bg-blue-500 text-white"
                            : "bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/40 text-blue-700 dark:text-blue-300"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}

                {/* Reset filters button */}
                {(activeStatuses.length > 0 || activeTags.length > 0 || searchTerm) && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 py-1 px-2 text-xs bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 ml-auto mt-1"
                  >
                    <FiRefreshCw size={10} />
                    Reset Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bounties Grid/List or No Bounties Message */}
        {error || sortedBounties.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-secondary-dark rounded-xl shadow border border-theme-border dark:border-theme-border-dark p-8">
            <FiBriefcase size={52} className="mx-auto text-theme-text/30 dark:text-theme-text-dark/30 mb-4" />
            <h2 className="text-xl font-semibold text-theme-title dark:text-theme-title-dark mb-2">
              {showOnlyAvailable 
                ? "No live bounties available right now." 
                : "No bounties available right now."}
            </h2>
            <p className="text-theme-text dark:text-theme-text-dark mb-4 max-w-md mx-auto">
              {showOnlyAvailable 
                ? "There are currently no open bounties available. You can disable the 'Available Only' filter to see all bounties including closed ones."
                : "If you're a company or team, you can post a new bounty directly on the PeerMe platform. Bounties will then be listed here."}
            </p>
            
            {showOnlyAvailable && filteredByDate.length > 0 ? (
              <Button
                label="Show All Bounties"
                icon={FiRefreshCw}
                theme="secondary"
                class="text-sm m-auto"
                onClick={() => setShowOnlyAvailable(false)}
              />
            ) : (
              <a href={peerMeSubmitUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button
                  label="Submit a Bounty on PeerMe"
                  icon={FiLink}
                  theme="primary"
                  class="text-sm m-auto"
                />
              </a>
            )}
            <p className="text-xs text-theme-text/70 dark:text-theme-text-dark/70 mt-6">
              All bounty applications and submissions are handled through the PeerMe platform.
            </p>
          </div>
        ) : (
          <div className={`grid gap-4 sm:gap-5 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {sortedBounties.map((bounty) => (
              <BountyCard key={bounty.id} bounty={bounty} viewMode={viewMode} />
            ))}
          </div>
        )}
      </section>

      <section id="process-explainer" className="py-10 md:py-16">
        <div className="container mx-auto">
            <BountyProcessExplainer />
        </div>
      </section>
    </Layout>
  );
}
