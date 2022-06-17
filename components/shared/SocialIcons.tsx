import { AiFillGithub } from 'react-icons/ai';
import { ImBook } from 'react-icons/im';

const items = [
  {
    label: "Github",
    href: "https://github.com/ElrondDevGuild",
    icon: AiFillGithub,
  },
  {
    label: "Docs",
    href: "https://elrond-dev-guild.gitbook.io/scrolls/",
    icon: ImBook,
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
