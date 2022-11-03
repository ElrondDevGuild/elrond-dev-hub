import { Menu, Transition } from '@headlessui/react';
import Link from 'next/link';
import { Fragment } from 'react';
import { IoMdAddCircleOutline as IconAdd } from 'react-icons/io';

import { classNames } from '../../utils/presentation';
import { submitBountyPath, submitPath } from '../../utils/routes';

export default function ButtonCreateResource({
  label,
  position,
  size,
}: {
  label?: string;
  position?: "right" | "left";
  size?: "small" | "large";
}) {
  const _position = position === "right" ? "left-0" : "right-0";
  const _size = size === "small" ? "w-40" : "w-56";
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="bg-primary dark:bg-primary-dark  text-secondary dark:text-secondary-dark border-transparent border font-medium text-xs sm:text-sm py-2 px-4 rounded-md transition-opacity ease-in-out hover:opacity-80 flex items-center disabled:opacity-80 disabled:cursor-not-allowed">
          <span className="">{label || "+ Create"}</span>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={classNames(
            _position,
            _size,
            "absolute z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none bg-secondary dark:bg-secondary-dark border border-theme-border dark:border-theme-border-dark divide-y divide-theme-border dark:divide-theme-border-dark"
          )}
        >
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link href={submitPath}>
                  <a className="flex items-center space-x-2 px-4 py-2 text-sm w-full text-theme-text dark:text-theme-text-dark">
                    <IconAdd className="h-5 w-5" />
                    <span>New Resource</span>
                  </a>
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link href={submitBountyPath}>
                  <a className="flex items-center space-x-2 px-4 py-2 text-sm w-full text-theme-text dark:text-theme-text-dark">
                    <IconAdd className="h-5 w-5" />
                    <span>New Bounty</span>
                  </a>
                </Link>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
