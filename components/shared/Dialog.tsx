/* This example requires Tailwind CSS v2.0+ */
import {Dialog, Transition} from '@headlessui/react';
import {Fragment, PropsWithChildren} from 'react';
import {AiOutlineClose} from 'react-icons/ai';

type PopupProps = PropsWithChildren<{
  title: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}>;
export default function Popup({open = false, setOpen, children, title}: PopupProps) {
  return (
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setOpen}>
          <div
              className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
              <Dialog.Overlay
                  className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                  className="inline-block bg-secondary dark:bg-secondary-dark px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle w-full sm:max-w-lg sm:p-6 rounded border border-theme-border dark:border-theme-border-dark">
                <div className="absolute top-0 right-0 hidden py-4 pr-4 sm:block">
                  <button
                      type="button"
                      className="rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <AiOutlineClose className="h-6 w-6" aria-hidden="true"/>
                  </button>
                </div>
                {title && <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-theme-title dark:text-theme-title-dark mx-4 mb-8">
                  {title}
                </Dialog.Title>
                }
                {children}
              </Dialog.Panel>
            </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
