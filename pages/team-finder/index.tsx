import { NextSeo } from "next-seo";
import Layout from "../../components/Layout";
import { FiLink, FiGithub } from "react-icons/fi";
import { FaXTwitter, FaTelegram, FaGlobe } from "react-icons/fa6";
import Button from "../../components/shared/Button";
import CategoryBadge from "../../components/shared/CategoryBadge";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import SubmitTeamFinder from "../../components/forms/SubmitTeamFinder";

interface DeveloperProfile {
  name: string;
  description: string;
  profileImageUrl: string;
  skills: string[];
  mainExpertise: string;
  availability: string;
  experience: string;
  interests: string;
  socials: {
    github: string | null;
    twitter: string | null;
    telegram: string | null;
    website: string | null;
  };
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to fetch developers from Supabase
const fetchDevelopers = async (): Promise<DeveloperProfile[]> => {
  try {
    const today = new Date().toISOString();

    // Fetch developers from Supabase where publish_date is not null and <= today
    const { data, error } = await supabase
      .from("tf_developers")
      .select("*")
      .lte("publish_date", today) // Only get profiles with publish_date <= current date
      .not("publish_date", "is", null) // Exclude unpublished profiles
      .order("name");

    if (error) {
      console.error("Error fetching developers from Supabase:", error);
      return []; // Return empty array on error
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
      socials: {
        github: dev.github_url,
        twitter: dev.twitter_url,
        telegram: dev.telegram_url,
        website: dev.website_url,
      },
    }));

    return developers;
  } catch (error) {
    console.error("Failed to fetch developers:", error);
    return []; // Return empty array on any error
  }
};

export default function TeamFinderPage() {
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
      socials: {
        github: "https://github.com/",
        twitter: "https://twitter.com/",
        telegram: "https://t.me/",
        website: "https://multiversx.com/",
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

  // Filter developers based on the activeCategory value.
  const filteredDevelopers =
    activeCategory === "all"
      ? developers
      : developers.filter((item) => item.mainExpertise === activeCategory);

  console.log(
    "Rendering TeamFinderPage with",
    filteredDevelopers.length,
    "filtered developers"
  );

  const DeveloperCard = ({ dev }: { dev: DeveloperProfile }) => {
    const descriptionRef = useRef<HTMLDivElement>(null);
    const [isTextOverflowing, setIsTextOverflowing] = useState(false);

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
      <div className="bg-secondary dark:bg-secondary-dark rounded-xl shadow-lg p-6 border border-theme-border/30 dark:border-theme-border-dark/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
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

        <div className="relative">
          {/* Badges positioned at top */}
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

          <div className="mb-4">
            <div className="relative">
              <div
                ref={descriptionRef}
                className={`text-sm text-theme-text dark:text-theme-text-dark ${
                  isTextOverflowing
                    ? "max-h-[2.5rem] group-hover:max-h-[1000px]"
                    : ""
                } transition-all duration-500 ease-in-out overflow-hidden`}
              >
                {dev.description}
              </div>
              {isTextOverflowing && (
                <>
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-secondary dark:from-secondary-dark via-secondary/90 dark:via-secondary-dark/90 to-transparent group-hover:opacity-0 transition-opacity duration-500"></div>
                  <div className="text-xs text-theme-text/60 dark:text-theme-text-dark/60 mt-1 group-hover:opacity-0 transition-opacity duration-500">
                    Hover to read more
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4 mb-6">
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
                {dev.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-medium text-theme-text dark:text-theme-text-dark"
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

            {/* Social Media Links */}
            <div className="flex flex-wrap gap-3 pt-2">
              {dev.socials.github && (
                <a
                  href={dev.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-100 hover:bg-primary/10 dark:bg-gray-800 dark:hover:bg-primary-dark/20 text-theme-text dark:text-theme-text-dark hover:text-primary dark:hover:text-primary-dark transition-colors duration-200"
                  title="GitHub Profile"
                >
                  <FiGithub className="w-4 h-4" />
                </a>
              )}
              {dev.socials.twitter && (
                <a
                  href={dev.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-100 hover:bg-primary/10 dark:bg-gray-800 dark:hover:bg-primary-dark/20 text-theme-text dark:text-theme-text-dark hover:text-primary dark:hover:text-primary-dark transition-colors duration-200"
                  title="Twitter/X Profile"
                >
                  <FaXTwitter className="w-4 h-4" />
                </a>
              )}
              {dev.socials.telegram && (
                <a
                  href={dev.socials.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-100 hover:bg-primary/10 dark:bg-gray-800 dark:hover:bg-primary-dark/20 text-theme-text dark:text-theme-text-dark hover:text-primary dark:hover:text-primary-dark transition-colors duration-200"
                  title="Telegram"
                >
                  <FaTelegram className="w-4 h-4" />
                </a>
              )}
              {dev.socials.website && (
                <a
                  href={dev.socials.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-100 hover:bg-primary/10 dark:bg-gray-800 dark:hover:bg-primary-dark/20 text-theme-text dark:text-theme-text-dark hover:text-primary dark:hover:text-primary-dark transition-colors duration-200"
                  title="Personal Website"
                >
                  <FaGlobe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div className="mt-6 z-10">
            <Button
              label="Connect"
              href={
                dev.socials.twitter ||
                dev.socials.telegram ||
                dev.socials.github ||
                dev.socials.website ||
                "#"
              }
              class="w-fit"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout hideRightBar>
      <NextSeo
        title="Team Finder - Connect with MultiversX Developers"
        description="Find collaborators for your MultiversX project. Connect with developers who share your vision and accelerate your development journey."
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
            Team Finder
          </h1>
          <p className="text-md md:text-lg text-theme-text dark:text-theme-text-dark max-w-2xl mx-auto pb-4">
            Great ideas need great teams. Connect with developers who share your
            vision. Whether you're building tools, dApps, or blockchain
            infrastructure, find collaborators to accelerate your progress.
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
                No developers found matching the selected criteria.
              </p>
            )}
          </div>
        )}
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

        {showForm && <SubmitTeamFinder onClose={() => setShowForm(false)} />}
      </section>
    </Layout>
  );
}
