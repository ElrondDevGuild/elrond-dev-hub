import {AiFillClockCircle} from 'react-icons/ai';
import {BsFillPersonFill} from 'react-icons/bs';
import {GoPrimitiveDot} from 'react-icons/go';
import {Bounty} from "../../types/supabase";
import moment from "moment";
import BountyStatus from "./BountyStatus";
import {useRouter} from "next/router";
import {bountyPath} from "../../utils/routes";
import Link from "next/link";

export default function BountyItem({bounty}: { bounty: Bounty }) {
  const router = useRouter();
  return (
      <li
          className="flex flex-col bg-white dark:bg-secondary-dark-lighter border border-theme-border dark:border-theme-border-dark rounded cursor-pointer"
          onClick={async () => {
            await router.push(bountyPath(bounty.id));
          }}
      >

        <div
            className="flex justify-between py-6 pl-6 border-b border-theme-border dark:border-theme-border-dark flex-col sm:flex-row"
        >
          <div
              className="text-theme-title dark:text-theme-title-dark font-semibold text-2xl order-last sm:order-first pr-6 sm:pr-0">
            <Link href={bountyPath(bounty.id)}>
              <a className="max-w-2xl">
                {bounty.title}
              </a>
            </Link>
          </div>
          <div
              className="font-semibold text-sm  flex-shrink-0 w-1/2 self-end sm:w-auto sm:self-start pb-4 sm:pb-0">
            <div
                className="text-secondary bg-theme-text dark:bg-theme-text-dark dark:text-secondary-dark-lighter py-[0.5px] px-6">
              {bounty.value} USDC
            </div>
          </div>
        </div>
        <div
            className="flex justify-between items-center p-6 text-theme-text dark:text-theme-text-dark font-semibold text-xs flex-col sm:flex-row">
          <div>
            <ul className="flex items-center space-x-3">
              {bounty.owner.verified && (
                  <>
                    <li className="uppercase flex items-center">
                      <img src="/verified_icon.svg" className="mr-1"/> verified
                    </li>
                    <li>•</li>
                  </>
              )}
            <li>
              <BountyStatus bounty={bounty}/>
            </li>
            <li>•</li>
            <li>{bounty.issue_type}</li>
            <li>•</li>
            <li>{bounty.experience_level}</li>
          </ul>
        </div>
        <div>
          <ul className="flex items-center space-x-3">
            <li className="flex items-center">
              <AiFillClockCircle
                  className="mr-1 text-sm"/> Opened {moment(bounty.created_at).fromNow()}
            </li>
            <li className="flex items-center">
              <BsFillPersonFill className="mr-1 text-sm"/> {bounty.applicationsCount} Applicants
            </li>
          </ul>
        </div>
      </div>
      </li>
  );
}
