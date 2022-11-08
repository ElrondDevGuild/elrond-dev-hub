import { useEffect, useState } from 'react';
import { FaStackOverflow, FaTelegramPlane } from 'react-icons/fa';
import {
  FiAlertCircle,
  FiBookOpen,
  FiBriefcase,
  FiCheckSquare,
  FiExternalLink,
  FiFolder,
  FiGithub,
  FiHome,
  FiMail,
  FiMessageCircle,
} from 'react-icons/fi';
import { SiPlausibleanalytics } from 'react-icons/si';

import { Category } from '../../types/supabase';
import { api } from '../../utils/api';
import { categoryPath, gettingStartedPath, homePath, submitPath } from '../../utils/routes';
import Button from '../shared/Button';
import LinksGroup, { ILinksGroupProps } from '../shared/LinksGroup';

const menuSection: ILinksGroupProps = {
  links: [
    {
      label: "Library",
      url: homePath,
      icon: FiHome,
    },
    {
      label: "Bounties",
      url: "#",
      icon: FiCheckSquare,
      disabled: true,
    },
    {
      label: "Newsletter",
      url: "https://newsletter.statescu.net/",
      icon: FiMail,
      openInNewTab: true,
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
      url: "https://docs.elrond.com/",
      icon: FiExternalLink,
      openInNewTab: true,
    },
    {
      label: "erdjs",
      url: "https://docs.elrond.com/sdk-and-tools/erdjs/erdjs/",
      icon: FiExternalLink,
      openInNewTab: true,
    },
    {
      label: "erdpy",
      url: "https://docs.elrond.com/sdk-and-tools/erdpy/erdpy/",
      icon: FiExternalLink,
      openInNewTab: true,
    },
    {
      label: "Validator Node",
      url: "https://docs.elrond.com/validators/system-requirements/",
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
      url: "https://twitter.com/StatescuRazvan",
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
      url: "https://t.me/ElrondDevelopers",
      openInNewTab: true,
      icon: FaTelegramPlane,
    },
    {
      label: "Ask Questions",
      url: "https://stackoverflow.com/questions/tagged/elrond",
      openInNewTab: true,
      icon: FaStackOverflow,
    },
  ],
};

export default function Leftbar() {
  const [categoriesSection, setCategoriesSection] = useState<ILinksGroupProps | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("categories");
        const links = data?.map((category: Category) => {
          return {
            label: category.title,
            url: categoryPath(category),
            icon: FiFolder,
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
      <div className="mb-8">
        <LinksGroup {...firstSection} />
      </div>
      {categoriesSection && (
        <div className="mb-8">
          <LinksGroup {...categoriesSection} />
        </div>
      )}
      <div className="mb-8">
        <LinksGroup {...sourceCode} />
      </div>
    </>
  );
}
