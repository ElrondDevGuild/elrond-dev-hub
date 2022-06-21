import { FiCheckSquare, FiExternalLink, FiFolder, FiHome, FiMail, FiMessageSquare } from 'react-icons/fi';

import { submitPath } from '../../utils/routes';
import Button from '../shared/Button';
import LinksGroup, { ILinksGroupProps } from '../shared/LinksGroup';

const menuSection: ILinksGroupProps = {
  links: [
    {
      label: "Library",
      url: "https://elrondgiants.com",
      icon: FiHome,
      openInNewTab: true,
    },
    {
      label: "Community",
      url: "https://elrondgiants.com",
      icon: FiMessageSquare,
      openInNewTab: true,
    },
    {
      label: "Newsletter",
      url: "https://elrondgiants.com",
      icon: FiMail,
      openInNewTab: true,
    },
    {
      label: "Bounties",
      url: "https://elrondgiants.com",
      icon: FiCheckSquare,
      openInNewTab: true,
    },
  ],
};

const firstSection: ILinksGroupProps = {
  title: "Reference",
  links: [
    {
      label: "Reference 1",
      url: "https://elrondgiants.com",
      icon: FiExternalLink,
      openInNewTab: true,
    },
    {
      label: "Reference 2",
      url: "https://elrondgiants.com",
      icon: FiExternalLink,
      openInNewTab: true,
    },
    {
      label: "Reference 3",
      url: "https://elrondgiants.com",
      icon: FiExternalLink,
      openInNewTab: true,
    },
  ],
};

const categoriesSection: ILinksGroupProps = {
  title: "Categories",
  links: [
    {
      label: "Cateogry 1",
      url: "https://elrondgiants.com",
      icon: FiFolder,
    },
    {
      label: "Category 2",
      url: "https://elrondgiants.com",
      icon: FiFolder,
    },
    {
      label: "Category 3",
      url: "https://elrondgiants.com",
      icon: FiFolder,
    },
  ],
};

export default function Leftbar() {
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
      <div className="mb-8">
        <LinksGroup {...categoriesSection} />
      </div>
    </>
  );
}
