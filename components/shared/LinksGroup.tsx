import Link from 'next/link';

export interface ILink {
  label: string;
  url: string;
  icon?: any;
  openInNewTab?: boolean;
  disabled?: boolean;
}

export interface ILinksGroupProps {
  title?: string;
  links: ILink[];
}

const LinkWrapper = ({ link, children }: { link: ILink; children: any }) => {
  if (link?.disabled) {
    return <span className="opacity-50 cursor-not-allowed">{children}</span>;
  }
  if (link.openInNewTab) {
    return (
      <a href={link.url} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return <Link href={link.url}>{children}</Link>;
};

export default function LinksGroup({ title, links }: ILinksGroupProps) {
  return (
    <div>
      {title && <div className="uppercase text-primary dark:text-primary-dark font-semibold text-xs">{title}</div>}
      <ul className="mt-4">
        {links?.map((link, index) => {
          return (
            <LinkWrapper link={link} key={index}>
              <li className="flex items-center font-medium text-sm text-theme-text dark:text-theme-text-dark my-4 cursor-pointer">
                <span className="pr-2">
                  <link.icon className="text-lg" />
                </span>
                {link.label}
              </li>
            </LinkWrapper>
          );
        })}
      </ul>
    </div>
  );
}
