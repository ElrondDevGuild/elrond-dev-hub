import { Disclosure } from '@headlessui/react';
import Link from 'next/link';
import { useMemo } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';

import { homePath, submitPath } from '../../utils/routes';
import Button from '../shared/Button';
import Logo from '../shared/Logo';
import SocialIcons from '../shared/SocialIcons';
import Leftbar from './LeftBar';
import SearchBar from './SearchBar';

const navbar = [
  {
    label: "home",
    href: homePath,
  },
];

export default function Navbar() {
  return (
    <Disclosure
      as="nav"
      className="bg-white dark:bg-secondary-dark border-b-0.5 border-theme-border dark:border-theme-border-dark "
    >
      {({ open }) => (
        <>
          <div className="px-8">
            <div className="flex items-center justify-between h-14 sm:h-24 max-w-screen-xl mx-auto">
              <div className="sm:w-1/4">
                <Link href={homePath}>
                  <div className="flex-shrink-0 cursor-pointer">
                    <div className="hidden sm:block">
                      <Logo />
                    </div>
                    <div className="sm:hidden">
                      <Logo onlyIcon={true} />
                    </div>
                  </div>
                </Link>
              </div>
              <div className="sm:w-2/4 hidden sm:block px-8">
                <SearchBar />
              </div>
              <div className="sm:ml-6 sm:w-1/4 flex items-center space-x-4 sm:space-x-5 justify-end">
                {/* Profile dropdown */}
                <SocialIcons />

                <Button label="+ Add Resource" href={submitPath} />

                <div className="-mr-2 flex sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md text-primary dark:text-primary-dark">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <AiOutlineClose className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <AiOutlineMenu className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden px-8 absolute w-full h-full bg-secondary dark:bg-secondary-dark bg-opacity-60 dark:bg-opacity-60">
            <div className="bg-secondary dark:bg-secondary-dark h-full w-4/5">
              <Leftbar />
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
