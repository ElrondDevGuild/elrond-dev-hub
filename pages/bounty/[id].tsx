import {useRouter} from "next/router";
import {useEffect} from "react";
import Layout from "../../components/Layout";
import RequiresAuth from "../../components/RequiresAuth";

export default function BountyDetails() {
    const router = useRouter();
    useEffect(() => {
        if (!router.isReady) {
            return;
        }
        const {id} = router.query;

    }, [router]);

    return (
        <Layout hideRightBar={true}>
            <RequiresAuth>
                <div>
                </div>
            </RequiresAuth>
        </Layout>
    );
};