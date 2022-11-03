/* This example requires Tailwind CSS v2.0+ */
import { Listbox, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { GoCheck } from 'react-icons/go';
import { HiSelector } from 'react-icons/hi';

import { classNames } from '../../../utils/presentation';

export interface IOption {
  id: string | number | boolean;
  name: string;
  icon?: JSX.Element;
  unavailable?: boolean;
}

interface ISelectElementProps {
  options: IOption[];
  onChange: (newValue: IOption) => void;
}

export default function SelectElement({ options, onChange }: ISelectElementProps) {
  const [selected, setSelected] = useState<IOption>();

  const _onChange = (newValue: IOption) => {
    setSelected(newValue);
  };

  useEffect(() => {
    if (options?.length) {
      setSelected(options[0]);
    }
  }, [options]);

  useEffect(() => {
    if (selected) onChange(selected);
  }, [selected]);

  if (!selected) return null;

  return (
    <Listbox value={selected} onChange={_onChange} >
      {({ open }) => (
        <>
          <div className="mt-1 relative">
            <Listbox.Button className="font-medium bg-white dark:bg-secondary-dark-lighter relative w-full border border-theme-border dark:border-theme-border-dark pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
              <span className="block truncate">{selected.name}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <HiSelector className="h-5 w-5 text-theme-text dark:text-theme-text-dark" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white dark:bg-secondary-dark-lighter shadow-lg max-h-60 py-1 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none text-sm">
                {options.map((option) => (
                  <Listbox.Option
                      // @ts-ignore
                    key={option.id}
                    className={({ active }) =>
                      classNames(
                        active
                          ? "text-secondary dark:text-secondary-dark bg-primary dark:bg-primary-dark"
                          : "text-theme-text dark:text-theme-text-dark",
                        "cursor-default select-none relative py-2 pl-3 pr-9"
                      )
                    }
                    value={option}
                    disabled={option.unavailable}
                  >
                    {({ selected, active }) => (
                        <>
                          <div
                              className={classNames(selected ? "font-semibold" : "font-normal", "flex items-center")}
                          >
                            {option.icon && (
                                <div className="flex items-center justify-center ml-1 mr-4">
                                  <div className="" aria-hidden="true">
                                    {option.icon}
                                  </div>
                                </div>
                            )}
                            <span className="truncate">{option.name}</span>
                          </div>

                          {selected ? (
                              <span
                                  className={classNames(
                                      active
                                          ? "text-secondary dark:text-secondary-dark"
                                          : "text-theme-text dark:text-theme-text-dark",
                                      "absolute inset-y-0 right-0 flex items-center pr-4"
                                  )}
                              >
                            <GoCheck className="h-5 w-5" aria-hidden="true"/>
                          </span>
                          ) : null}
                        </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
