import { useEffect, useState } from 'react';
import { BiPlus } from 'react-icons/bi';
import { IoReturnUpBackOutline } from 'react-icons/io5';

import Layout from '../components/Layout';
import Button from '../components/shared/Button';
import { homePath, submitPath } from '../utils/routes';

export default function ThankYou() {
  return (
    <Layout hideRightBar={true}>
      <div className="px-16 text-theme-text dark:text-theme-text-dark flex items-center justify-center mt-32">
        <div className="flex flex-col items-center">
          <h1 className="font-semibold text-4xl text-theme-title dark:text-theme-title-dark text-center">
            Thank you for your contribution!
          </h1>
          <p className="mt-4 text-theme-text dark:text-theme-text-dark text-center">
            {" "}
            Submissions will be manually reviewed before publishing them to the platform.
          </p>

          <div className="flex items-center md:space-x-6 mt-10 flex-col md:flex-row space-y-6 md:space-y-0">
            <Button icon={BiPlus} label="Add New Resource" href={submitPath} />
            <Button icon={IoReturnUpBackOutline} label="Return to homepage" theme="secondary" href={homePath} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
