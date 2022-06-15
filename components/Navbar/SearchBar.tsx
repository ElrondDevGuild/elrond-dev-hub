import { AiOutlineSearch } from 'react-icons/ai';

export default function SearchBar() {
  return (
    <div>
      <div className="relative rounded-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <AiOutlineSearch className="h-5 w-5 text-theme-text dark:text-theme-text-dark" aria-hidden="true" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 sm:text-sm border-theme-border dark:border-theme-border-dark rounded-md bg-transparent text-theme-text dark:text-theme-text-dark placeholder:text-theme-text placeholder:dark:text-theme-text-dark"
          placeholder="Search..."
        />
      </div>
    </div>
  );
}
