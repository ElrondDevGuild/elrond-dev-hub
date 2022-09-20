import {useRouter} from "next/router";
import {useEffect} from "react";
import {authPath} from "../utils/routes";
import {useAuth} from "../hooks/useAuth";

export default function RequiresAuth({children}: { children: any }) {
    const {authenticated, loading} = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (authenticated || loading) {
            return;
        }

        (async () => {
            await router.replace(authPath);
        })();
    }, [authenticated, router, loading]);

    if (authenticated) {
        return <>{children}</>
    }
    return <div>Loading</div>
};
