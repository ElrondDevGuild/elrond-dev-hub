import { useEffect, useState } from 'react';
import { FiBriefcase, FiCheckSquare, FiExternalLink, FiFolder, FiHome, FiMail } from 'react-icons/fi';

import { Category } from '../../types/supabase';
import { api } from '../../utils/api';
import { categoryPath, homePath, submitPath } from '../../utils/routes';
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
      label: "Newsletter",
      url: "#",
      icon: FiMail,
      openInNewTab: true,
      disabled: true,
    },
    {
      label: "Bounties",
      url: "#",
      icon: FiCheckSquare,
      openInNewTab: true,
      disabled: true,
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
      label: "Elrond Docs",
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
        <LinksGroup {...firstSection} />
      </div>
      {categoriesSection && (
        <div className="mb-8">
          <LinksGroup {...categoriesSection} />
        </div>
      )}
    </>
  );
}
