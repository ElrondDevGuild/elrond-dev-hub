import { FiBook, FiGithub } from 'react-icons/fi';

const items = [
  {
    label: "Github",
    href: "https://github.com/xdevguild",
    icon: FiGithub,
  },
  {
    label: "Docs",
    href: "https://elrond-dev-guild.gitbook.io/scrolls/",
    icon: FiBook,
  },
];

export default function SocialIcons() {
  return (
    <div className="flex items-center space-x-4 sm:space-x-5">
      {items.map((item, index) => (
        <a href={item.href} key={index} target="_blank" rel="noreferrer">
          <item.icon className={`text-xl text-primary dark:text-primary-dark`} />
        </a>
      ))}
    </div>
  );
}
