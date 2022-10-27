import BountyItem from '../../components/bounty/BountyItem';
import Layout from '../../components/Layout';
import {useEffect, useState} from "react";
import Loader from "../../components/shared/Loader";
import {Bounty} from "../../types/supabase";
import {api} from "../../utils/api";
import {FiPlusCircle, FiX} from "react-icons/fi";
import Link from "next/link";
import {useAuth} from "../../hooks/useAuth";
import {classNames} from "../../utils/presentation";

type Filters= {
    [key: string]: any
};
const pageSize = 10;
export default function BountyListing() {
    const [bounties, setBounties] = useState([]);
    const [hasNext, setHasNext] = useState(false);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [initialLoad, setInitialLoad] = useState(true);
    const [page, setPage] = useState(0);
    const [filters, setFilters] = useState<Filters>({});
    const {user} = useAuth();

    const loadItems = async (page: number) => {
        if (loading) {
            return;
        }

        setLoading(true);
        try {
            const {data: {bounties, count}} = await api.get("bounties", {
                params: {page, page_size: pageSize, ...filters}
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
    };
    const setFilter = (key: string, value: string) => {
        setFilters((oldFilters) => ({...oldFilters, [key]: value}));
    };

    const clearFilter = (key: string) => {
        setFilters((oldFilters) => {
            const newFilters = {...oldFilters};
            delete newFilters[key];
            return newFilters;
        });
    };

    const hasFilter = (key: string) => {
        return filters[key] !== undefined;
    };

    useEffect(() => {
        if (totalPages) {
            if (page + 1 < totalPages) {
                setHasNext(true);
            } else {
                setHasNext(false);
            }
        }else {
            setHasNext(false);
        }
    }, [totalPages, page]);


    useEffect(() => {
        loadItems(0);
    }, []);

    const onNext = async () => {
        loadItems(page + 1);
    };

    useEffect(() => {
        loadItems(0);
    }, [filters]);

    if (initialLoad) {
        return (
            <Layout hideRightBar={true}>
                <Loader/>
            </Layout>
        );
    }

    return (
        <Layout hideRightBar={true}>
            <div className="flex items-center justify-start space-x-3 pb-4">
                <Link href={"/bounty/create"}>
                    <a className="uppercase text-primary dark:text-primary-dark text-sm">
                        + add bounty
                    </a>
                </Link>
                {user && <Link href={""}>
                    <a
                        className={classNames(
                            "flex items-center uppercase text-sm text-theme-text dark:text-theme-text-dark",
                            hasFilter("owner") ? "underline" : ""
                        )}
                        onClick={(e) => {
                            e.preventDefault();
                            if (hasFilter("owner")) {
                                clearFilter("owner");
                            }else {
                                setFilter("owner", user.id);
                            }
                        }}
                    >
                        {hasFilter("owner") && <FiX className="text-md mr-0.5"/>}
                        <span>my bounties</span>
                    </a>
                </Link>
                }
            </div>
            <ul className="flex flex-col space-y-8">
                {bounties.map((bounty: Bounty) => (
                    <BountyItem key={bounty.id} bounty={bounty}/>
                ))}
            </ul>
            {hasNext && (
                <button
                    className="text-primary dark:text-primary-dark flex items-center font-semibold text-xs uppercase hover:underline mx-auto mt-12 disabled:cursor-not-allowed disabled:opacity-75"
                    onClick={onNext}
                    disabled={loading}
                >
                    <FiPlusCircle
                        className="pr-1 text-2xl"/> {loading ? "Loading..." : "Load More bounties"}
                </button>
            )}
        </Layout>
    );
}
