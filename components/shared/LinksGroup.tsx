import Link from "next/link";
import { BiChevronRight } from "react-icons/bi";

export interface ILink {
  label: string;
  url: string;
  icon?: any;
  openInNewTab?: boolean;
  disabled?: boolean;
  customComponent?: boolean;
  onClick?: () => void;
}

export interface ILinksGroupProps {
  title?: string;
  links: ILink[];
}

const LinkWrapper = ({ link, children }: { link: ILink; children: any }) => {
  // Handle onClick first
  if (link.onClick) {
    return <span onClick={link.onClick} className={link.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}>{children}</span>;
  }
  // Original disabled logic
  if (link?.disabled) {
    return <span className="opacity-50 cursor-not-allowed">{children}</span>;
  }
  // Original openInNewTab logic
  if (link.openInNewTab) {
    return (
      <a href={link.url} target="_blank" rel="noreferrer" className="cursor-pointer">
        {children}
      </a>
    );
  }
  // Original Next.js Link logic
  return <Link href={link.url} className="cursor-pointer">{children}</Link>;
};

export default function LinksGroup({ title, links }: ILinksGroupProps) {
  return (
    <div>
      {title && (
        <div className="uppercase text-primary dark:text-primary-dark font-semibold text-xs mb-4 ">
          {title}
        </div>
      )}
      <ul className="flex flex-col space-y-4">
        {links?.map((link, index) => {
          console.log(link);
          // If it's a custom component, render the icon directly without the usual menu item structure
          if (link.customComponent && link.icon) {
            return <li key={index}>{link.icon()}</li>;
          }
          // Regular item rendering using LinkWrapper
          return (
            <LinkWrapper link={link} key={index}>
              <li className="flex items-center font-medium text-sm text-theme-text dark:text-theme-text-dark relative hover:!text-theme-text cursor-pointer">
                <span className="pr-2">
                  <link.icon className="text-lg" />
                </span>
                {link.label}
                {!link.onClick && <BiChevronRight className="absolute right-0 sm:hidden " />} {/* Hide arrow if it's an action */}
              </li>
            </LinkWrapper>
          );
        })}
      </ul>
    </div>
  );
}
