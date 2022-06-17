import { useMemo } from 'react';

import Navbar from './Navbar';
import Leftbar from './Navbar/LeftBar';
import Button from './shared/Button';

interface IColumnClasses {
  leftColumn: string;
  centerColumn: string;
  rightColum: string;
}

export default function Layout({ hideRightBar = false, children }: any) {
  const columnClasses = useMemo<IColumnClasses>(() => {
    if (hideRightBar) {
      return {
        leftColumn: "hidden sm:block sm:w-1/4 md:w-3/12 lg:w-2/12",
        centerColumn: "w-full sm:w-3/4 md:w-9/12 lg:w-10/12 sm:pl-8",
        rightColum: "hidden",
      };
    }
    return {
      leftColumn: "hidden sm:block sm:w-1/4 md:w-3/12 lg:w-2/12",
      centerColumn: "w-full sm:w-3/4 md:w-9/12 lg:w-7/12 sm:pl-8 lg:px-8",
      rightColum: "hidden sm:w-3/12 lg:block",
    };
  }, [hideRightBar]);
  return (
    <div>
      <Navbar />
      <div className="px-8">
        <div className="max-w-screen-xl mx-auto flex">
          <div
            className={`${columnClasses.leftColumn} py-10 border-r-0.5 border-theme-border dark:border-theme-border-dark main-content-height overflow-y-auto scrollbar-thin scrollbar-thumb-scrollbar-thumb scrollbar-track-scrollbar dark:scrollbar-thumb-scrollbar-dark-thumb dark:scrollbar-track-scrollbar-dark`}
          >
            <Leftbar />
          </div>
          <main
            className={`${columnClasses.centerColumn} py-10 main-content-height overflow-y-auto scrollbar-thin scrollbar-thumb-scrollbar-thumb scrollbar-track-scrollbar dark:scrollbar-thumb-scrollbar-dark-thumb dark:scrollbar-track-scrollbar-dark`}
          >
            {children}
          </main>
          <div className={`${columnClasses.rightColum} py-10`}>
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
