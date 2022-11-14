import { Dialog } from '@headlessui/react';

import Popup from './shared/Dialog';

interface PopupProps {
  qrCode: string;
  uri: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function MaiarLoginPopup({ qrCode, uri, open, setOpen }: PopupProps) {
  const platform = require("platform");
  const isMobile = platform?.os?.family === "iOS" || platform?.os?.family === "Android";

  return (
    <Popup open={open} setOpen={setOpen} withCloseButton={false}>
      <div className="flex flex-col items-center text-primary dark:text-primary-dark">
        <Dialog.Title as="h3" className="text-xl">
          Login with Maiar
        </Dialog.Title>
        <div className="w-60 h-60 mt-6" dangerouslySetInnerHTML={{ __html: qrCode }} />
        <p className="mt-2 text-lg">Scan the QR code using Maiar</p>
        {isMobile ? (
          <a
            href={uri}
            className="mt-6 inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            rel="noopener noreferrer nofollow"
            target="_blank"
          >
            Login with Maiar
          </a>
        ) : null}
        <button
          className="mt-6 text-theme-text dark:text-theme-text-dark "
          onClick={() => {
            setOpen(false);
          }}
        >
          cancel
        </button>
      </div>
    </Popup>
  );
}
