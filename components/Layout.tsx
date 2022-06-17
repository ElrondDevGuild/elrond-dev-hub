import { AiOutlineFolder } from 'react-icons/ai';
import { FiExternalLink } from 'react-icons/fi';
import { IoPeopleOutline } from 'react-icons/io5';

import Navbar from './Navbar';
import Button from './shared/Button';
import LinksGroup, { ILinksGroupProps } from './shared/LinksGroup';

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

export default function Layout({ children }: any) {
  return (
    <div>
      <Navbar />
      <div className="px-8">
        <div className="max-w-screen-xl mx-auto flex main-content-height">
          <div className="w-2/12 sm:w-1/4 md:w-3/12 lg:w-2/12 hidden sm:block py-10 border-r-0.5 border-theme-border dark:border-theme-border-dark">
            <div className="mb-8">
              <LinksGroup {...menuSection} />
            </div>
            <div className="mb-8">
              <Button label="+ Add Resource" />
            </div>
            <div className="mb-8">
              <LinksGroup {...firstSection} />
            </div>
            <div className="mb-8">
              <LinksGroup {...categoriesSection} />
            </div>
          </div>
          <main className="w-full sm:w-3/4 md:w-9/12 lg:w-7/12 sm:pl-8 lg:px-8 py-10">{children}</main>
          <div className="hidden w-3/12 lg:block py-10">
            <div className="p-6 bg-theme-title  dark:bg-secondary-dark-lighter rounded-md">
              <p className="font-semibold text-xl text-white dark:text-theme-title-dark mb-5">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.
              </p>
              <Button label="CTA Button" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
