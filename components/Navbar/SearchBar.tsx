import { useRouter } from 'next/router';
import { AiOutlineSearch } from 'react-icons/ai';

import { searchPath } from '../../utils/routes';

export default function SearchBar() {
  const router = useRouter();

  return (
    <div>
      <div className="relative rounded-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <AiOutlineSearch className="h-5 w-5 text-theme-text dark:text-theme-text-dark" aria-hidden="true" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 sm:text-sm border-0.5 border-theme-border dark:border-theme-border-dark rounded-md bg-transparent text-theme-text dark:text-theme-text-dark placeholder:text-theme-text placeholder:dark:text-theme-text-dark"
          placeholder="Search..."
          onKeyUp={(e: any) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (e.target.value) {
                router.push(searchPath(e.target.value));
              }
            }
          }}
        />
      </div>
    </div>
  );
}
