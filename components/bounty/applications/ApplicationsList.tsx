import {Bounty, BountyApplication} from "../../../types/supabase";
import {useAuth} from "../../../hooks/useAuth";
import {useEffect, useState} from "react";
import {api} from "../../../utils/api";
import UserRating from "../../UserRating";
import {BsCheck, BsX} from "react-icons/bs";
import ApplicationListItem from "./ApplicationListItem";


export default function ApplicationsList({bounty}: { bounty: Bounty }) {
    const {user} = useAuth();
    const [applications, setApplications] = useState<BountyApplication[]>([]);
    const [loading, setLoading] = useState(false);

    const loadApplications = async () => {
        setLoading(true);
        try {
            const {data: applications} = await api.get(`bounties/${bounty.id}/applications`);
            setApplications(applications);
        } catch (e) {

        } finally {
            setLoading(false);
        }
    };

    const openApplication = (application: BountyApplication) => {
        alert("Not implemented yet");
    };


    useEffect(() => {
        if (bounty.owner_id !== user?.id) {
            return;
        }
        loadApplications();
    }, [bounty, user]);

    if (loading) {

    }

    return (
        <ul role="list" className="divide-y divide-theme-border dark:divide-theme-border-dark">
            {applications.map((application) => (
                <ApplicationListItem
                    application={application}
                    openApplication={openApplication}
                    key={application.id}
                />
            ))}
        </ul>
    );
};