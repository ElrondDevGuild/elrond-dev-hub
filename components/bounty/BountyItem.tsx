import { AiFillClockCircle } from 'react-icons/ai';
import { BsFillPersonFill } from 'react-icons/bs';

export default function BountyItem() {
  return (
    <div className="flex flex-col bg-secondary dark:bg-secondary-dark-lighter border border-theme-border dark:border-theme-border-dark rounded">
      <div className="flex justify-between py-6 pl-6 border-b border-theme-border dark:border-theme-border-dark">
        <div className="text-theme-title dark:text-theme-title-dark font-semibold text-2xl">
          <div className="max-w-2xl">
            RSK + API3 Bounty: Enable P2p Transfers on RSK Network + Use API 3 Price Feeds
          </div>
        </div>
        <div className="font-semibold text-sm  flex-shrink-0">
          <div className="text-secondary bg-theme-text dark:bg-theme-text-dark dark:text-secondary-dark-lighter py-[0.5px] px-6">
            1,000 USDC
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center p-6 text-theme-text dark:text-theme-text-dark font-semibold text-xs">
        <div>
          <ul className="flex items-center space-x-3">
            <li className="uppercase">verified</li>
            <li>•</li>
            <li className="text-primary dark:text-primary-dark uppercase">ready to work</li>
            <li>•</li>
            <li>Traditional</li>
            <li>•</li>
            <li>Advanced</li>
          </ul>
        </div>
        <div>
          <ul className="flex items-center space-x-3">
            <li className="flex items-center">
              <AiFillClockCircle className="mr-1 text-sm" /> Opened 3 days ago
            </li>
            <li className="flex items-center">
              <BsFillPersonFill className="mr-1 text-sm" /> 4 Applicants
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
