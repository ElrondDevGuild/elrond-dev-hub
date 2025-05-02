import { useEffect, useState } from "react";
import { FaStackOverflow, FaTelegramPlane } from "react-icons/fa";
import {
  FiAlertCircle,
  FiAlignCenter,
  FiArchive,
  FiArrowRight,
  FiBookOpen,
  FiBriefcase,
  FiCheckSquare,
  FiExternalLink,
  FiFolder,
  FiGift,
  FiGithub,
  FiHeadphones,
  FiHome,
  FiList,
  FiMail,
  FiMessageCircle,
  FiOctagon,
  FiServer,
  FiTool,
  FiUsers,
} from "react-icons/fi";
import { SiPlausibleanalytics } from "react-icons/si";

import { Category } from "../../types/supabase";
import { api } from "../../utils/api";
import {
  categoryPath,
  expertsPath,
  gettingStartedPath,
  homePath,
  monthlyLeaderboardPath,
  submitPath,
} from "../../utils/routes";
import Button from "../shared/Button";
import LinksGroup, { ILinksGroupProps } from "../shared/LinksGroup";
import NewsletterPopup from "../shared/NewsletterPopup";

// State moved outside component to avoid closure issues in link definition
let _isNewsletterPopupOpen = false;
let _setIsNewsletterPopupOpen: React.Dispatch<React.SetStateAction<boolean>> | null = null;

const menuSection: ILinksGroupProps = {
  links: [
    {
      label: "Library",
      url: homePath,
      icon: FiHome,
    },
    // {
    //   label: "Experts",
    //   url: expertsPath,
    //   icon: FiUsers,
    // },

    {
      label: "ToolIndex [🆕]",
      url: "/toolindex",
      icon: FiAlignCenter,
    },
    // {
    //   label: "Whishlist [🆕]",
    //   url: "/whishlist",
    //   icon: FiGift,
    // },
    {
      label: "Bounties [🆕]",
      url: "/bounties",
      icon: FiGift,
    },
    {
      label: "Team Finder [🆕]",
      url: "/team-finder",
      icon: FiUsers,
    },
    {
      label: "Monthly L..Board [🆕]",
      url: monthlyLeaderboardPath,
      icon: FiList,
    },
    {
      label: "",
      url: "#",
      icon: () => (
        <div className="w-full flex items-center my-2">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent flex-grow"></div>
        </div>
      ),
      customComponent: true,
    },
    // {
    //   label: "Podcast ↗️",
    //   url: "https://podcast.xdevhub.com/",
    //   icon: FiHeadphones,
    //   openInNewTab: true,
    // },
    {
      label: "Full Shard Podcast ↗️",
      url: "https://www.youtube.com/@FullShardPodcast",
      icon: FiHeadphones,
      openInNewTab: true,
    },
    {
      label: "Momentum Podcast ↗️",
      url: "https://youtube.com/playlist?list=PLQVcheGWwBRVIDczUGjpx60NDfBEWl7xh&feature=shared",
      icon: FiHeadphones,
      openInNewTab: true,
    },
    {
      label: "Growth Games ↗️",
      url: "https://multiversx.com/growthgames",
      icon: FiCheckSquare,
      disabled: false,
      openInNewTab: true,
    },
    {
      label: "",
      url: "#",
      icon: () => (
        <div className="w-full flex items-center my-2">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent flex-grow"></div>
        </div>
      ),
      customComponent: true,
    },
    {
      label: "Newsletter",
      url: "#",
      icon: FiMail,
      onClick: () => _setIsNewsletterPopupOpen?.(true),
    },
    {
      label: "Jobs",
      url: "#",
      icon: FiBriefcase,
      openInNewTab: true,
      disabled: true,
    },
  ],
};

const firstSection: ILinksGroupProps = {
  title: "Reference",
  links: [
    {
      label: "Docs",
      url: "https://docs.multiversx.com/",
      icon: FiExternalLink,
      openInNewTab: true,
    },
    {
      label: "sdk-js",
      url: "https://docs.multiversx.com/sdk-and-tools/sdk-js/",
      icon: FiExternalLink,
      openInNewTab: true,
    },
    {
      label: "mxpy",
      url: "https://github.com/multiversx/mx-sdk-py-cli",
      icon: FiExternalLink,
      openInNewTab: true,
    },
    {
      label: "Validator Node",
      url: "https://docs.multiversx.com/validators/overview",
      icon: FiExternalLink,
      openInNewTab: true,
    },
  ],
};

const sourceCode: ILinksGroupProps = {
  title: "dev hub",
  links: [
    {
      label: "Source Code",
      url: "https://github.com/ElrondDevGuild/elrond-dev-hub",
      icon: FiGithub,
      openInNewTab: true,
    },
    {
      label: "Feedback",
      url: "https://forms.gle/oyen4QTVpJoPgmZi8",
      icon: FiAlertCircle,
      openInNewTab: true,
    },
    {
      label: "Contact",
      url: "https://twitter.com/egldhub",
      icon: FiMessageCircle,
      openInNewTab: true,
    },
    {
      label: "Analytics",
      url: "https://plausible.io/xdevhub.com",
      icon: SiPlausibleanalytics,
      openInNewTab: true,
    },
  ],
};

const gettingStartedSection: ILinksGroupProps = {
  links: [
    {
      label: "Getting Started",
      url: gettingStartedPath,
      icon: FiBookOpen,
    },
    {
      label: "Dev Group",
      url: "https://t.me/MultiversXDevelopers",
      openInNewTab: true,
      icon: FaTelegramPlane,
    },
    {
      label: "Ask Questions",
      url: "https://stackoverflow.com/questions/tagged/multiversx",
      openInNewTab: true,
      icon: FaStackOverflow,
    },
  ],
};

export default function Leftbar() {
  const [categoriesSection, setCategoriesSection] =
    useState<ILinksGroupProps | null>(null);
  // Use state within the component instance
  const [isNewsletterPopupOpen, setIsNewsletterPopupOpen] = useState(false);

  // Update the setter function available to the static menuSection definition
  useEffect(() => {
    _setIsNewsletterPopupOpen = setIsNewsletterPopupOpen;
    // Cleanup function to prevent memory leaks
    return () => {
      _setIsNewsletterPopupOpen = null;
    };
  }, [setIsNewsletterPopupOpen]);

  // Map of category titles to icons
  const categoryIconMap: Record<string, React.ElementType> = {
    "Smart Contracts": FiCheckSquare,
    Frontend: FiExternalLink,
    Backend: FiServer,
    Tools: FiBriefcase,
    Tutorials: FiBookOpen,
    Libraries: FiFolder,
    Articles: FiFolder,
    Videos: FiExternalLink,
    Podcasts: FiHeadphones,
    Courses: FiBookOpen,
    Projects: FiBriefcase,
    Others: FiOctagon,
    "Dev Tools": FiTool,
    // Add more mappings as needed
  };

  // Default icon to use if no mapping is found
  const defaultCategoryIcon = FiFolder;

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("categories");
        const links = data?.map((category: Category) => {
          // Get the icon from the map or use default
          const icon = categoryIconMap[category.title] || defaultCategoryIcon;

          return {
            label: category.title,
            url: categoryPath(category),
            icon: icon,
          };
        });

        setCategoriesSection({
          title: "Categories",
          links,
        });
      } finally {
      }
    })();
  }, []);

  // Update the state reference for the popup rendering
  _isNewsletterPopupOpen = isNewsletterPopupOpen;

  return (
    <>
      <div className="mb-8">
        <LinksGroup {...menuSection} />
      </div>
      <div className="mb-8">
        <Button label="+ Add Resource" href={submitPath} />
      </div>
      <div className="mb-8">
        <LinksGroup {...gettingStartedSection} />
      </div>
      {categoriesSection && (
        <div className="mb-8">
          <LinksGroup {...categoriesSection} />
        </div>
      )}
      <div className="mb-8">
        <LinksGroup {...firstSection} />
      </div>
      <div className="mb-8">
        <LinksGroup {...sourceCode} />
      </div>

      {/* Conditionally render the popup based on the component's state */}
      {isNewsletterPopupOpen && (
        <NewsletterPopup onClose={() => setIsNewsletterPopupOpen(false)} />
      )}
    </>
  );
}
