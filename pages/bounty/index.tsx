import BountyItem from '../../components/bounty/BountyItem';
import Layout from '../../components/Layout';
import {useEffect, useState} from "react";
import Loader from "../../components/shared/Loader";
import {Bounty} from "../../types/supabase";
import {api} from "../../utils/api";
import {FiPlusCircle} from "react-icons/fi";

const pageSize = 10;
export default function BountyListing() {
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
                params: {page, page_size: pageSize}
            });
            setBounties(
                (oldBounties) => page === 0 ? bounties : [...oldBounties, ...bounties]
            );
            setPage(page);

            setTotalPages(Math.ceil(count / pageSize));
        } finally {
            setLoading(false);
            setInitialLoad(false);
        }
    }

    useEffect(() => {
        if (totalPages) {
            if (page + 1 < totalPages) {
                setHasNext(true);
            } else {
                setHasNext(false);
            }
        }
    }, [totalPages, page]);


    useEffect(() => {
        loadItems(0);
    }, []);

    const onNext = async () => {
        loadItems(page + 1);
    };

    if (initialLoad) {
        return (
            <Layout hideRightBar={true}>
                <Loader/>
            </Layout>
        );
    }

    return (
        <Layout hideRightBar={true}>
            <div className="flex flex-col space-y-8">
                {bounties.map((bounty: Bounty) => (
                    <BountyItem key={bounty.id} bounty={bounty}/>
                ))}
            </div>
            {hasNext && (
                <button
                    className="text-primary dark:text-primary-dark flex items-center font-semibold text-xs uppercase hover:underline mx-auto mt-12 disabled:cursor-not-allowed disabled:opacity-75"
                    onClick={onNext}
                    disabled={loading}
                >
                    <FiPlusCircle className="pr-1 text-2xl" /> {loading ? "Loading..." : "Load More resources"}
                </button>
            )}
        </Layout>
    );
}
