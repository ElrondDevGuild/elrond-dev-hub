import { NextSeo } from "next-seo";
import Layout from "../../components/Layout";
import { FiLink, FiGithub, FiUser, FiGrid, FiList } from "react-icons/fi";
import { FaXTwitter, FaTelegram, FaGlobe } from "react-icons/fa6";
import Button from "../../components/shared/Button";
import CategoryBadge from "../../components/shared/CategoryBadge";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import SubmitTeamFinder from "../../components/forms/SubmitTeamFinder";
import DeveloperBadge from "../../components/shared/DeveloperBadge";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import Link from "next/link";

interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
}

interface DeveloperProfile {
  name: string;
  description: string;
  profileImageUrl: string;
  skills: string[];
  mainExpertise: string;
  availability: string;
  experience: string;
  interests: string;
  badges: Badge[];
  socials: {
    github: string | null;
    twitter: string | null;
    telegram: string | null;
    website: string | null;
    email: string | null;
  };
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const defaultBadge: Badge = {
  id: "xdev-member",
  name: "xDev Member",
  description: "Active member of the MultiversX Developer Hub community",
  imageUrl: "/badges/xdev-member.svg",
  category: "Community",
};

// Function to fetch developers from Supabase
const fetchDevelopers = async (): Promise<DeveloperProfile[]> => {
  try {
    const today = new Date().toISOString();

    // Fetch developers from Supabase where publish_date is not null and <= today
    const { data, error } = await supabase
      .from("tf_developers")
      .select("*")
      .lte("publish_date", today)
      .not("publish_date", "is", null)
      .order("name");

    if (error) {
      console.error("Error fetching developers from Supabase:", error);
      return [];
    }

    // Transform the data from Supabase format to our DeveloperProfile interface
    const developers: DeveloperProfile[] = data.map((dev) => ({
      name: dev.name,
      description:
        dev.description ||
        "MultiversX developer ready to collaborate on exciting projects.",
      profileImageUrl: dev.profile_image_url || "/default/default-avatar.png",
      skills: dev.skills,
      mainExpertise: dev.main_expertise,
      availability: dev.availability,
      experience: dev.experience,
      interests: dev.interests,
      badges: dev.badges ? [...dev.badges, defaultBadge] : [defaultBadge],
      socials: {
        github: dev.github_url,
        twitter: dev.twitter_url,
        telegram: dev.telegram_url,
        website: dev.website_url,
        email: dev.email,
      },
    }));

    return developers;
  } catch (error) {
    console.error("Failed to fetch developers:", error);
    return [];
  }
};

export default function TeamFinderPage() {
  const router = useRouter();
  const { developer } = router.query;
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [developers, setDevelopers] = useState<DeveloperProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Static developer data as fallback
  const staticDeveloperData: DeveloperProfile[] = [
    {
      name: "Cool Developer",
      description: "#C#O#O#L#D#E#V#E#L#O#P#E#R#",
      profileImageUrl: "/team-finder/alex-johnson.jpg",
      skills: ["Rust", "TypeScript", "Smart Contracts"],
      mainExpertise: "be the first",
      availability: "always",
      experience: "☺ years",
      interests: "DeFi and NFTs",
      badges: [
        {
          id: "xdev-member",
          name: "xDev Member",
          description:
            "Active member of the MultiversX Developer Hub community",
          imageUrl: "/badges/xdev-member.png",
          category: "Community",
        },
      ],
      socials: {
        github: "https://github.com/",
        twitter: "https://twitter.com/",
        telegram: "https://t.me/",
        website: "https://multiversx.com/",
        email: null,
      },
    },
  ];

  useEffect(() => {
    const loadDevelopers = async () => {
      setLoading(true);
      try {
        const supabaseDevelopers = await fetchDevelopers();

        // Use data from Supabase if available, otherwise use static data
        if (supabaseDevelopers.length > 0) {
          const randomizedDevelopers = [...supabaseDevelopers].sort(
            () => Math.random() - 0.5
          );
          setDevelopers(randomizedDevelopers);
        } else {
          const randomizedStaticData = [...staticDeveloperData].sort(
            () => Math.random() - 0.5
          );
          setDevelopers(randomizedStaticData);
        }
      } catch (error) {
        console.error("Error loading developers:", error);
        setDevelopers(staticDeveloperData); // Fallback to static data
      } finally {
        setLoading(false);
      }
    };

    loadDevelopers();
  }, []);

  // Filter developers based on the activeCategory value and URL parameter
  const filteredDevelopers = developers.filter((item) => {
    // If developer parameter is present, only show that developer
    if (developer) {
      return item.name.toLowerCase() === (developer as string).toLowerCase();
    }
    // Otherwise, filter by category
    return activeCategory === "all" || item.mainExpertise === activeCategory;
  });

  console.log(
    "Rendering TeamFinderPage with",
    filteredDevelopers.length,
    "filtered developers"
  );

  const DeveloperCard = ({ dev }: { dev: DeveloperProfile }) => {
    const descriptionRef = useRef<HTMLDivElement>(null);
    const [isTextOverflowing, setIsTextOverflowing] = useState(false);
    const [group, setGroup] = useState(false);

    useEffect(() => {
      if (descriptionRef.current) {
        const lineHeight = parseInt(
          window.getComputedStyle(descriptionRef.current).lineHeight
        );
        const height = descriptionRef.current.scrollHeight;
        setIsTextOverflowing(height > lineHeight * 2);
      }
    }, [dev.description]);

    return (
      <div
        className="bg-secondary dark:bg-secondary-dark rounded-xl shadow-lg p-6 border border-theme-border/30 dark:border-theme-border-dark/30 hover:shadow-xl transition-all duration-300 flex flex-col h-full group relative overflow-hidden"
        onMouseEnter={() => setGroup(true)}
        onMouseLeave={() => setGroup(false)}
      >
        <div
          className={`absolute top-0 left-0 w-full h-1 ${
            dev.availability === "Available"
              ? "bg-green-500"
              : dev.availability === "Part-time"
              ? "bg-blue-500"
              : "bg-amber-500"
          }`}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="flex flex-col h-full">
          {/* Top section with badges */}
          <div className="flex justify-between mb-4">
            <CategoryBadge
              size="sm"
              category={dev.mainExpertise}
              className="z-10"
            />
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                dev.availability === "Available"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : dev.availability === "Part-time"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              }`}
            >
              {dev.availability}
            </span>
          </div>

          {/* Profile section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mr-3 border-2 border-primary/20">
                <img
                  src={dev.profileImageUrl}
                  alt={`${dev.name}&apos;s profile`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/default/default-avatar.png";
                  }}
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-theme-title dark:text-theme-title-dark group-hover:text-primary dark:group-hover:text-primary-dark transition-colors duration-200">
                  {dev.name}
                </h2>
              </div>
            </div>
          </div>

          {/* Description section */}
          <div className="mb-4">
            <div className="relative">
              <motion.div
                ref={descriptionRef}
                initial={false}
                animate={{
                  height: isTextOverflowing
                    ? group
                      ? descriptionRef.current?.scrollHeight || "auto"
                      : "2.5rem"
                    : "auto",
                }}
                transition={{
                  duration: 0.7,
                  ease: [0.4, 0, 0.2, 1],
                  opacity: { duration: 0.3 },
                }}
                className="text-sm text-theme-text dark:text-theme-text-dark overflow-hidden"
              >
                {dev.description}
              </motion.div>
              {isTextOverflowing && (
                <>
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: group ? 0 : 1 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-secondary dark:from-secondary-dark via-secondary/90 dark:via-secondary-dark/90 to-transparent"
                  />
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{
                      opacity: group ? 0 : 1,
                      height: group ? 0 : "auto",
                      marginTop: group ? 0 : 8,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className="absolute bottom-0 left-0 right-0 text-xs text-theme-text/60 dark:text-theme-text-dark/60 overflow-hidden text-left pb-1"
                  >
                    Hover to read more
                  </motion.div>
                </>
              )}
            </div>
          </div>

          {/* Info section */}
          <div className="space-y-4">
            <div className="flex text-sm">
              <div className="mr-1 text-theme-text/60 dark:text-theme-text-dark/60">
                Experience:
              </div>
              <div className="font-medium text-theme-text dark:text-theme-text-dark">
                {dev.experience}
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm text-theme-text/60 dark:text-theme-text-dark/60">
                Skills:
              </div>
              <div className="flex flex-wrap gap-2">
                {dev.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-full text-theme-text dark:text-theme-text-dark"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex text-sm">
              <div className="mr-1 text-theme-text/60 dark:text-theme-text-dark/60">
                Interests:
              </div>
              <div className="font-medium text-theme-text dark:text-theme-text-dark">
                {dev.interests}
              </div>
            </div>
          </div>

          {/* Badges section */}
          {dev.badges && dev.badges.length > 0 && (
            <div className="mt-2 mb-4">
              <div className="text-sm text-theme-text/60 dark:text-theme-text-dark/60 mb-1">
                Badges & Achievements
              </div>
              <div className="flex flex-wrap gap-1.5">
                {dev.badges.map((badge) => (
                  <DeveloperBadge key={badge.id} badge={badge} />
                ))}
              </div>
            </div>
          )}

          {/* Social links and contact button */}
          <div className="mt-auto z-50">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                {dev.socials.github && (
                  <a
                    href={dev.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-theme-text dark:text-theme-text-dark hover:text-primary dark:hover:text-primary-dark transition-colors duration-200"
                  >
                    <FiGithub className="w-5 h-5" />
                  </a>
                )}
                {dev.socials.twitter && (
                  <a
                    href={dev.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-theme-text dark:text-theme-text-dark hover:text-primary dark:hover:text-primary-dark transition-colors duration-200"
                  >
                    <FaXTwitter className="w-5 h-5" />
                  </a>
                )}
                {dev.socials.telegram && (
                  <a
                    href={dev.socials.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-theme-text dark:text-theme-text-dark hover:text-primary dark:hover:text-primary-dark transition-colors duration-200"
                  >
                    <FaTelegram className="w-5 h-5" />
                  </a>
                )}
                {dev.socials.website && (
                  <a
                    href={dev.socials.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-theme-text dark:text-theme-text-dark hover:text-primary dark:hover:text-primary-dark transition-colors duration-200"
                  >
                    <FaGlobe className="w-5 h-5" />
                  </a>
                )}
              </div>

              <Button
                label="Contact"
                href={
                  dev.socials.twitter ||
                  dev.socials.telegram ||
                  dev.socials.website ||
                  dev.socials.github ||
                  "#"
                }
                class="w-24 justify-center"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout hideRightBar>
      <NextSeo
        title="MultiversX Team Finder | Connect with Developers"
        description="Find developers to collaborate with on your MultiversX projects. Connect with experienced blockchain developers specializing in smart contracts, DeFi, and more."
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
      <div className="container mx-auto px-4">
        {/* Header section with slightly reduced padding */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary-dark/10 dark:to-primary-dark/20 rounded-2xl p-6 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-4xl font-bold text-theme-title dark:text-theme-title-dark mb-4 relative">
              MultiversX Team Finder
              <div className="absolute w-14 h-0.5 bg-primary dark:bg-primary-dark left-1/2 transform -translate-x-1/2 bottom-0"></div>
            </h1>
            <p className="text-sm md:text-base text-theme-text dark:text-theme-text-dark max-w-3xl mx-auto">
              Connect with talented developers specializing in MultiversX blockchain development.
              Find collaborators for your next project or showcase your own skills to the community.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <div onClick={() => setShowForm(true)}>
              <Button
                label="Join as Developer"
                icon={FiUser}
                class="text-sm py-2 px-4"
              />
            </div>
            
            <Link href="#developers">
              <a>
                <Button
                  label="Find a Developer"
                  icon={FiLink}
                  theme="secondary"
                  class="text-sm py-2 px-4"
                />
              </a>
            </Link>
          </div>
        </div>

        {/* Compact filters section */}
        <div id="developers" className="mb-5 bg-white dark:bg-secondary-dark rounded-xl shadow-lg p-3 border border-theme-border dark:border-theme-border-dark">
          <div className="flex flex-col md:flex-row justify-between items-center mb-3">
            <div>
              <h2 className="text-base font-semibold text-theme-title dark:text-theme-title-dark flex items-center">
                <span className="mr-2">Developers</span>
                {filteredDevelopers.length > 0 && (
                  <span className="text-xs font-normal text-theme-text/60 dark:text-theme-text-dark/60">
                    ({filteredDevelopers.length} available)
                  </span>
                )}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3 md:mt-0">
              {/* View mode toggle */}
              <div className="flex items-center text-xs font-medium mr-3">
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
            
              <label className="text-xs text-theme-text/80 dark:text-theme-text-dark/80 mr-1">
                Expertise:
              </label>
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
                <button
                  onClick={() => setActiveCategory("Frontend")}
                  className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                    activeCategory === "Frontend"
                      ? "bg-primary text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  Frontend
                </button>
                <button
                  onClick={() => setActiveCategory("Backend")}
                  className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                    activeCategory === "Backend"
                      ? "bg-primary text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  Backend
                </button>
                <button
                  onClick={() => setActiveCategory("Smart Contracts")}
                  className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                    activeCategory === "Smart Contracts"
                      ? "bg-primary text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  Smart Contracts
                </button>
                <button
                  onClick={() => setActiveCategory("Full Stack")}
                  className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                    activeCategory === "Full Stack"
                      ? "bg-primary text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-theme-text dark:text-theme-text-dark hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  Full Stack
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Developer list */}
        <div className="mb-10">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary dark:border-primary-dark"></div>
            </div>
          ) : filteredDevelopers.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 p-6 bg-gray-100 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50 max-w-3xl mx-auto mb-8">
              <p className="font-semibold text-sm mb-2">No developers match your criteria</p>
              <p className="text-xs mb-4">Try selecting a different expertise or check back later.</p>
              <div onClick={() => setShowForm(true)}>
                <Button
                  label="Join as Developer"
                  icon={FiUser}
                  theme="secondary"
                  class="text-xs py-1.5 px-3 mx-auto"
                />
              </div>
            </div>
          ) : (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredDevelopers.map((dev) => (
                    <motion.div
                      key={dev.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <DeveloperCard dev={dev} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDevelopers.map((dev) => (
                  <div 
                    key={dev.name}
                    className="bg-white dark:bg-secondary-dark rounded-xl overflow-hidden shadow-sm border border-theme-border dark:border-theme-border-dark p-4"
                  >
                    <div className="flex items-start gap-4">
                      {/* Profile Image */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full overflow-hidden">
                          <img
                            src={dev.profileImageUrl}
                            alt={`${dev.name}&apos;s profile`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      {/* Developer Info */}
                      <div className="flex-grow">
                        <div className="flex flex-wrap justify-between items-center mb-2">
                          <h3 className="text-lg font-bold text-theme-title dark:text-theme-title-dark">
                            {dev.name}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                            dev.mainExpertise === "Frontend" 
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                              : dev.mainExpertise === "Backend" 
                              ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                              : dev.mainExpertise === "Smart Contracts"
                              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                              : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          }`}>
                            {dev.mainExpertise}
                          </span>
                        </div>
                        
                        <p className="text-xs text-theme-text/80 dark:text-theme-text-dark/80 mb-2 line-clamp-2">
                          {dev.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {dev.skills.slice(0, 5).map((skill, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 dark:bg-gray-800 text-xs px-2 py-0.5 rounded-full text-theme-text dark:text-theme-text-dark"
                            >
                              {skill}
                            </span>
                          ))}
                          {dev.skills.length > 5 && (
                            <span className="text-xs text-theme-text/60 dark:text-theme-text-dark/60">
                              +{dev.skills.length - 5}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                          <div>
                            <span className="font-medium text-theme-text/70 dark:text-theme-text-dark/70">
                              Experience:
                            </span>
                            <span className="ml-1 text-theme-text dark:text-theme-text-dark">
                              {dev.experience}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-theme-text/70 dark:text-theme-text-dark/70">
                              Availability:
                            </span>
                            <span className="ml-1 text-theme-text dark:text-theme-text-dark">
                              {dev.availability}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-theme-text/70 dark:text-theme-text-dark/70">
                              Interests:
                            </span>
                            <span className="ml-1 text-theme-text dark:text-theme-text-dark line-clamp-1">
                              {dev.interests}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Social links */}
                      <div className="flex-shrink-0 flex flex-col gap-2">
                        <div className="flex gap-2 justify-end">
                          {dev.socials.github && (
                            <a
                              href={dev.socials.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark"
                            >
                              <FiGithub size={15} />
                            </a>
                          )}
                          {dev.socials.twitter && (
                            <a
                              href={dev.socials.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark"
                            >
                              <FaXTwitter size={15} />
                            </a>
                          )}
                          {dev.socials.telegram && (
                            <a
                              href={dev.socials.telegram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark"
                            >
                              <FaTelegram size={15} />
                            </a>
                          )}
                          {dev.socials.website && (
                            <a
                              href={dev.socials.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark"
                            >
                              <FaGlobe size={15} />
                            </a>
                          )}
                        </div>
                        <div className="flex flex-wrap justify-end gap-1">
                          {dev.badges.length > 0 && (
                            <div
                              key={dev.badges[0].id}
                              className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800/30 rounded-full px-2 py-1"
                            >
                              <img
                                src={dev.badges[0].imageUrl}
                                alt={dev.badges[0].name}
                                className="w-3 h-3 mr-1"
                              />
                              <span className="text-xs text-yellow-800 dark:text-yellow-300 font-medium">
                                {dev.badges[0].name}
                              </span>
                            </div>
                          )}
                          {dev.badges.length > 1 && (
                            <span className="text-xs text-theme-text/60 dark:text-theme-text-dark/60">
                              +{dev.badges.length - 1}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Developer submission form */}
      {showForm && <SubmitTeamFinder onClose={() => setShowForm(false)} />}
    </Layout>
  );
}
