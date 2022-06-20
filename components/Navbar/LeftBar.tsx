import { AiOutlineFolder } from 'react-icons/ai';
import { FiExternalLink } from 'react-icons/fi';
import { IoPeopleOutline } from 'react-icons/io5';

import { submitPath } from '../../utils/routes';
import Button from '../shared/Button';
import LinksGroup, { ILinksGroupProps } from '../shared/LinksGroup';

const menuSection: ILinksGroupProps = {
  links: [
    {
      label: "Menu 1",
      url: "https://elrondgiants.com",
      icon: IoPeopleOutline,
    },
    {
      label: "Menu 2",
      url: "https://elrondgiants.com",
      icon: FiExternalLink,
    },
    {
      label: "Menu 3",
      url: "https://elrondgiants.com",
      icon: FiExternalLink,
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
      icon: AiOutlineFolder,
    },
    {
      label: "Category 2",
      url: "https://elrondgiants.com",
      icon: AiOutlineFolder,
    },
    {
      label: "Category 3",
      url: "https://elrondgiants.com",
      icon: AiOutlineFolder,
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
