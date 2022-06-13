import { Disclosure } from '@headlessui/react';
import Link from 'next/link';
import { useMemo } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';

import { homePath } from '../../utils/routes';
import Button from '../shared/Button';
import SocialIcons from '../shared/SocialIcons';

const navbar = [
  {
    label: "home",
    href: homePath,
  },
];

export default function Navbar() {
  return (
    <Disclosure as="nav" className="bg-secondary dark:bg-secondary-dark">
      {({ open }) => (
        <>
          <div className="px-8 sm:px-0">
            <div className="flex items-center justify-between h-16">
              <div className="">
                <Link href={homePath}>
                  <div className="flex-shrink-0 cursor-pointer">
                    <img src="/logo_light.svg" alt="Elrond Dev Hub" className="dark:hidden" />
                    <img src="/logo_dark.svg" alt="Elrond Dev Hub" className="hidden dark:block" />
                  </div>
                </Link>
              </div>
              <div>search bar</div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex items-center space-x-8">
                  {/* Profile dropdown */}
                  <SocialIcons />
                  <Button label="+ Add Resource" />
                </div>
              </div>
              <div className="-mr-2 flex sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-white">
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

          <Disclosure.Panel className="sm:hidden px-8">
            <div className="pt-2 pb-3 space-y-1">
              {navbar.map(({ label, href }, index) => (
                <Disclosure.Button
                  as="div"
                  className="text-gray-100 px-2 py-2 rounded-md text-sm font-medium uppercase cursor-pointer"
                  key={index}
                >
                  <Link href={href} key={index}>
                    {label}
                  </Link>
                </Disclosure.Button>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-transparent-green flex justify-center">
              <SocialIcons />
              <Button label="+ Add Resource" />
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
