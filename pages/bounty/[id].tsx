import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Layout from "../../components/Layout";
import RequiresAuth from "../../components/RequiresAuth";
import {Bounty} from "../../types/supabase";
import Loader from "../../components/shared/Loader";
import {api} from "../../utils/api";
import axios from "axios";

export default function BountyDetails() {
    const [bounty, setBounty] = useState<Bounty | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const getBounty = async (id: string) => {
        try {
            const {data: {bounty}} = await api.get(`bounties/${id}`);
            setBounty(bounty);
        } catch (e) {
            if (axios.isAxiosError(e) && e.response?.status === 404) {
                router.push("/404");
            }
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (!router.isReady) {
            return;
        }
        const {id} = router.query;
        getBounty(id as string);

    }, [router]);

    if (loading || !bounty) {
        return (
            <Layout hideRightBar={true}>
                <RequiresAuth>
                    <Loader/>
                </RequiresAuth>
            </Layout>
        )
    }

    return (
        <Layout hideRightBar={true}>
            <RequiresAuth>
                <div className="flex flex-col w-full bg-white dark:bg-secondary-dark-lighter">
                    <div className="flex items-start">

                    </div>
                </div>
            </RequiresAuth>
        </Layout>
    );
};