import {Bounty, User} from "../../types/supabase";
import {useEffect, useState} from "react";
import {api} from "../../utils/api";

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
                params: {page, page_size: 5, owner_id: user.id}
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
        loadItems(0);
    }, []);

    const onNext = async () => {
        loadItems(page + 1);
    };

    if (initialLoad) {
        return Array.from({length: 5}).map((_, index) => (
            <div key={index} className="flex items-center animate-pulse">
                <span className="w-2/3 h-1 bg-theme-text dark:bg-theme-text-dark rounded-3xl"></span>
                <span className="w-1/3 h-1 bg-theme-text dark:bg-theme-text-dark rounded-3xl"></span>
            </div>
        ));
    }

    return (
        <div></div>
    );
}