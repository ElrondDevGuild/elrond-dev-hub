import { NextSeo } from "next-seo";
import Layout from "../../components/Layout";
import { FiLink, FiGithub } from "react-icons/fi";
import { FaXTwitter, FaTelegram, FaGlobe } from "react-icons/fa6";
import Button from "../../components/shared/Button";
import CategoryBadge from "../../components/shared/CategoryBadge";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import SubmitTeamFinder from "../../components/forms/SubmitTeamFinder";
import DeveloperBadge from "../../components/shared/DeveloperBadge";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

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
  const filteredDevelopers = developers
    .filter((item) => {
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
                  alt={dev.name}
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
        title={developer ? `${developer} - MultiversX Developer Profile` : "Team Finder - Connect with MultiversX Developers"}
        description={developer 
          ? `View the developer profile of ${developer} in the MultiversX ecosystem.`
          : "Find collaborators for your MultiversX project. Connect with developers who share your vision and accelerate your development journey."}
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
            {developer ? developer : "Team Finder"}
          </h1>
          <p className="text-md md:text-lg text-theme-text dark:text-theme-text-dark max-w-2xl mx-auto pb-4">
            {developer 
              ? `View the developer profile of ${developer} in the MultiversX ecosystem.`
              : "Great ideas need great teams. Connect with developers who share your vision. Whether you're building tools, dApps, or blockchain infrastructure, find collaborators to accelerate your progress."}
          </p>
          {developer && (
            <a
              href="/team-finder"
              className="inline-block mt-4 px-4 py-2 text-sm font-medium text-primary hover:text-primary-dark dark:text-primary-dark dark:hover:text-primary transition-colors duration-200"
            >
              ← View All Developers
            </a>
          )}
        </div>

        {/* Only show category filters if no specific developer is selected */}
        {!developer && (
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
                All Developers
              </button>
              {developers.length > 0 &&
                Array.from(
                  new Set(developers.map((item) => item.mainExpertise))
                ).map((expertise) => (
                  <button
                    key={expertise}
                    onClick={() => setActiveCategory(expertise)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-colors duration-200 ${
                      activeCategory === expertise
                        ? "bg-primary text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-theme-text dark:text-theme-text-dark hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {expertise}
                  </button>
                ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDevelopers.length > 0 ? (
              filteredDevelopers.map((dev, index) => (
                <DeveloperCard key={index} dev={dev} />
              ))
            ) : (
              <p className="text-center col-span-full text-theme-text dark:text-theme-text-dark">
                {developer 
                  ? `Developer "${developer}" not found.`
                  : "No developers found matching the selected criteria."}
              </p>
            )}
          </div>
        )}

        {/* Only show the "Join as a Builder" section if no specific developer is selected */}
        {!developer && (
          <div className="text-center mt-12">
            <p className="text-theme-text dark:text-theme-text-dark mb-4">
              Are you a developer looking to join exciting MultiversX projects?
            </p>
            <a
              onClick={() => setShowForm(true)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:cursor-pointer inline-block bg-primary text-white font-semibold py-3 px-6 rounded-full hover:bg-primary-dark dark:bg-primary-dark dark:hover:bg-primary transition-colors duration-200"
            >
              Join as a Builder
            </a>
          </div>
        )}

        {showForm && <SubmitTeamFinder onClose={() => setShowForm(false)} />}
      </section>
    </Layout>
  );
}
