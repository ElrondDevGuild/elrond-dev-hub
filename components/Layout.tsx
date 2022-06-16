import { FiExternalLink } from 'react-icons/fi';

import Navbar from './Navbar';
import LinksGroup, { ILinksGroupProps } from './shared/LinksGroup';

const firstSection: ILinksGroupProps = {
  title: "Reference",
  links: [
    {
      label: "Reference 1",
      url: "https://elrondgiants.com",
      icon: FiExternalLink,
      openInNewTab: true,
    },
  ],
};

export default function Layout({ children }: any) {
  return (
    <div>
      <Navbar />
      <div className="max-w-screen-2xl mx-auto flex main-content-height">
        <div className="w-1/4 py-10 border-r-0.5 border-theme-border dark:border-theme-border-dark hidden sm:block">
          <LinksGroup {...firstSection} />
        </div>
        <main className="w-2/4 px-8 py-10">{children}</main>
        <div className="w-1/4 py-10 hidden sm:block">right bar</div>
      </div>
    </div>
  );
}
