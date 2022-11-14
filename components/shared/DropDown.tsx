/* This example requires Tailwind CSS v2.0+ */
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { IoEllipsisVertical } from 'react-icons/io5';

import { classNames } from '../../utils/presentation';

export type DropdownOption = {
  label: string;
  onClick: () => void;
};
type DropdownOpenOptions = {
  label?: string;
  icon?: JSX.Element;
};

type DropdownProps = {
  options: DropdownOption[];
  openOptions?: DropdownOpenOptions;
  positionX?: "right" | "left";
  positionY?: "top" | "bottom";
};

export default function DropDown({ options, openOptions, positionX, positionY }: DropdownProps) {
  const _positionX = positionX === "right" ? "left-0" : "right-0";
  const _positionY = positionY === "top" ? "bottom-0" : "top-6";
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex items-center rounded-full text-primary dark:text-primary-dark focus:outline-none hover:opacity-80">
          {openOptions?.label ? (
            <span className="">{openOptions.label}</span>
          ) : (
            <span className="sr-only">Open options</span>
          )}
          {openOptions?.icon ? openOptions.icon : <IoEllipsisVertical className="h-5 w-5" aria-hidden="true" />}
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
            _positionX,
            _positionY,
            "absolute  z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none bg-secondary dark:bg-secondary-dark border border-theme-border dark:border-theme-border-dark divide-y divide-theme-border dark:divide-theme-border-dark"
          )}
        >
          <div className="py-1">
            {options.map((option, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <button
                    onClick={option.onClick}
                    className="flex items-center justify-center space-x-2 px-4 py-2 text-sm w-full text-theme-text dark:text-theme-text-dark"
                  >
                    {option.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
