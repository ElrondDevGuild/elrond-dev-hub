import Link from 'next/link';
import { useEffect, useState } from 'react';

import { BountyApplication, User } from '../../types/supabase';
import { api } from '../../utils/api';
import { classNames } from '../../utils/presentation';
import { bountyPath } from '../../utils/routes';
import ItemsLoader from '../shared/ItemsLoader';

export default function UserApplicationsList({ user }: { user: User }) {
  const [applications, setApplications] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);
  const [page, setPage] = useState(0);

  const loadItems = async (page: number) => {
    if (loading) {
      return;
    }

    setLoading(true);
    try {
      const {
        data: { applications, count },
      } = await api.get("bounties/applications", {
        params: { page, page_size: 5, owner_id: user.id },
      });
      setApplications((oldApplications) => (page === 0 ? applications : [...oldApplications, ...applications]));
      setPage(page);

      setTotalPages(Math.ceil(count / 5));
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    if (totalPages) {
      if (page + 1 < totalPages) {
        setHasNext(true);
      } else {
        setHasNext(false);
      }
    } else {
      setHasNext(false);
    }
  }, [totalPages, page]);

  useEffect(() => {
    setInitialLoad(true);
    loadItems(0);
  }, [user]);

  const onNext = async () => {
    loadItems(page + 1);
  };

  if (initialLoad) {
    return <ItemsLoader quantity={5} />;
  }

  return (
    <div className="w-full">
      <ul role="list" className="">
        {applications.map((application: BountyApplication) => (
          <li
            key={application.id}
            className="flex items-center justify-between w-full py-2 text-theme-text dark:text-theme-text-dark border-b border-theme-border dark:border-theme-border-dark"
          >
            <Link href={bountyPath(application.bounty_id)}>
              <a className="w-2/5 underline flex items-center justify-start">
                <span className="truncate">{application.bounty!.title}</span>
              </a>
            </Link>

            <div className="flex items-center">
              <span
                className={classNames(
                  application.approval_status === "pending" ? "dark:text-secondary" : "",
                  application.approval_status === "accepted" ? "text-green-500 dark:text-green-400" : "",
                  application.approval_status === "rejected" ? "text-red-500 dark:text-red-400" : ""
                )}
              >
                {application.approval_status === "pending" ? "Pending client action" : null}
                {application.approval_status === "rejected" ? "Rejected by client" : null}
                {application.approval_status === "accepted" ? "Accepted by client" : null}
              </span>
            </div>
          </li>
        ))}
      </ul>
      {loading && !initialLoad && <span className="text-sm dark:text-secondary">Loading...</span>}
      {hasNext && !loading && !initialLoad && (
        <button className="text-sm mt-4 underline dark:text-secondary" onClick={onNext}>
          Load more
        </button>
      )}
    </div>
  );
}
