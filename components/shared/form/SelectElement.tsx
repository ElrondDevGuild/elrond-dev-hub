/* This example requires Tailwind CSS v2.0+ */
import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { GoCheck } from "react-icons/go";
import { HiSelector } from "react-icons/hi";

import { classNames } from "../../../utils/presentation";

export interface IOption {
  id: string;
  name: string;
}

interface ISelectElementProps {
  options: IOption[];
  onChange: (newValue: IOption) => void;
}

export default function SelectElement({
  options,
  onChange,
}: ISelectElementProps) {
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
    <Listbox value={selected} onChange={_onChange}>
      {({ open }) => (
        <>
          <div className="relative w-full">
            <Listbox.Button className="rounded-md w-full bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark text-left text-sm py-2 px-3 focus:outline-none">
              <span className="block truncate font-medium">{selected.name}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <HiSelector
                  className="h-5 w-5 text-theme-text dark:text-theme-text-dark"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 text-sm border border-theme-border dark:border-theme-border-dark overflow-auto focus:outline-none">
                {options.map((person) => (
                  <Listbox.Option
                    key={person.id}
                    className={({ active }) =>
                      classNames(
                        active
                          ? "bg-primary dark:bg-primary-dark text-white"
                          : "text-theme-text dark:text-theme-text-dark",
                        "cursor-pointer select-none relative py-2 px-3"
                      )
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {person.name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-primary dark:text-primary-dark",
                              "absolute inset-y-0 right-0 flex items-center pr-3"
                            )}
                          >
                            <GoCheck className="h-5 w-5" aria-hidden="true" />
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
