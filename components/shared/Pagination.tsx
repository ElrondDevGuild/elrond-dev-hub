/* This example requires Tailwind CSS v2.0+ */
import { HiOutlineArrowNarrowLeft, HiOutlineArrowNarrowRight } from 'react-icons/hi';

interface IPaginationProps {
  onPrevious: () => Promise<void>;
  onNext: () => Promise<void>;
  hasPrevious: boolean;
  hasNext: boolean;
}

export default function Pagination({ onPrevious, onNext, hasPrevious, hasNext }: IPaginationProps) {
  if (!hasNext && !hasPrevious) {
    return null;
  }
  return (
    <nav className="border-t border-theme-border dark:border-theme-border-dark px-4 flex items-center justify-between sm:px-0">
      {hasPrevious && (
        <div className="-mt-px w-0 flex-1 flex">
          <a
            href="#"
            className="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-theme-text dark:text-theme-text-dark hover:opacity-75"
            onClick={onPrevious}
          >
            <HiOutlineArrowNarrowLeft className="mr-3 h-5 w-5" aria-hidden="true" />
            Previous
          </a>
        </div>
      )}

      {hasNext && (
        <div className="-mt-px w-0 flex-1 flex justify-end">
          <a
            href="#"
            className="border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-theme-text dark:text-theme-text-dark hover:opacity-75"
            onClick={onNext}
          >
            Next
            <HiOutlineArrowNarrowRight className="ml-3 h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      )}
    </nav>
  );
}
