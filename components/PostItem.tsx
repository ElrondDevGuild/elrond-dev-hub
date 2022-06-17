import { BiLink } from 'react-icons/bi';
import { FiTwitter } from 'react-icons/fi';
import { HiOutlineDocumentText } from 'react-icons/hi';

export interface IPostItem {
  title: string;
  image: string;
  category: string;
  description: string;
  author: string;
  tags: string[];
}

export default function PostItem({}: IPostItem) {
  return (
    <div className="flex flex-col w-full border-0.5 border-theme-border dark:border-theme-border-dark rounded-md bg-white dark:bg-secondary-dark-lighter shadow-sm">
      <div className="border-b-0.5 border-theme-border dark:border-theme-border-dark">
        <img
          src="https://picsum.photos/682/350"
          alt="Random image"
          className="object-cover h-64 w-full object-center rounded-t-md"
        />
      </div>
      <div className="py-7 px-8">
        <div className="text-theme-title dark:text-theme-title-dark mb-2">By Elrond Giants</div>
        <div className="font-semibold text-2xl text-theme-title dark:text-theme-title-dark mb-3">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, suscipit.
        </div>
        <p className="text-theme-text dark:text-theme-text-dark mb-4">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis, laboriosam. Odio et obcaecati, temporibus
          adipisci quasi tenetur cumque atque beatae!
        </p>
        <div className="text-sm text-primary dark:text-primary-dark">tags</div>
      </div>
      <div className="flex text-theme-text dark:text-theme-text-dark py-5 border-t-0.5 border-theme-border dark:border-theme-border-dark divide-x-0.5 divide-theme-border dark:divide-theme-border-dark">
        <div className="flex-1 flex items-center justify-center">
          <HiOutlineDocumentText className="mr-1 text-xl" /> Read article
        </div>
        <div className="flex-1 flex items-center justify-center">
          <FiTwitter className="mr-1 text-xl" /> Share on Twitter
        </div>
        <div className="flex-1 flex items-center justify-center">
          <BiLink className="mr-1 text-xl" /> Copy link
        </div>
      </div>
    </div>
  );
}
