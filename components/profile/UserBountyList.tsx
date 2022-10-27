import {Bounty, User} from "../../types/supabase";
import {useEffect, useState} from "react";
import {api} from "../../utils/api";
import ItemsLoader from "../shared/ItemsLoader";
import BountyStatus from "../bounty/BountyStatus";
import Link from "next/link";
import {bountyPath} from "../../utils/routes";

export default function UserBountyList({user}: { user: User }) {
    const [bounties, setBounties] = useState([]);
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
            const {data: {bounties, count}} = await api.get("bounties", {
                params: {page, page_size: 5, owner: user.id}
            });
            setBounties(
                (oldBounties) => page === 0 ? bounties : [...oldBounties, ...bounties]
            );
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
        return <ItemsLoader quantity={5}/>;
    }

    return (
        <div className="w-full">
            <ul role="list" className="">
                {bounties.map((bounty: Bounty) => (
                    <li key={bounty.id}
                        className="flex items-center w-full py-2 dark:text-secondary border-b border-theme-border dark:border-theme-border-dark">
                        <Link
                            href={bountyPath(bounty.id)}
                        >
                            <a className="w-2/5 sm:w-3/5 underline flex items-center justify-start">
                            <span className="truncate">
                            {bounty.title}
                            </span>
                            </a>
                        </Link>
                        <div className="flex items-center justify-between w-3/5 sm:w-2/5">
                            <BountyStatus bounty={bounty}/>
                            <Link
                                href={bountyPath(bounty.id)}
                            >
                                <a className="underline">
                                    {bounty.applicationsCount} {bounty.applicationsCount === 1 ? "Applicant" : "Applicants"}
                                </a>
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
            {loading && !initialLoad && (
                <span className="text-sm dark:text-secondary">Loading...</span>
            )}
            {hasNext && !loading && !initialLoad && (
                <button
                    className="text-sm mt-4 underline dark:text-secondary"
                    onClick={onNext}
                >
                    Load more
                </button>
            )}
        </div>
    );
}