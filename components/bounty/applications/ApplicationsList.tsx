import {Bounty, BountyApplication, ItemWithUserRating} from "../../../types/supabase";
import {useAuth} from "../../../hooks/useAuth";
import {useEffect, useState} from "react";
import {api, getApiErrorMessage} from "../../../utils/api";
import UserRating from "../../UserRating";
import {BsCheck, BsX} from "react-icons/bs";
import ApplicationListItem from "./ApplicationListItem";
import ApplicationDetailsModal from "./ApplicationDetailsModal";


export default function ApplicationsList({bounty}: { bounty: Bounty }) {
    const {user} = useAuth();
    const [applications, setApplications] = useState<ItemWithUserRating<BountyApplication>[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentApplication, setCurrentApplication] = useState<BountyApplication | null>(null);

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
        setCurrentApplication(application);
    };

    const acceptApplication = async (application: BountyApplication): Promise<boolean> => {
        try {
            const {data: updatedApplication} = await api.patch(
                `bounties/${bounty.id}/applications/${application.id}/accept`
            );
            setApplications(prevState => {
                const index = prevState.findIndex(a => a.id === updatedApplication.id);
                prevState[index] = {...prevState[index], ...updatedApplication};
                return [...prevState];
            });
            return true;
        } catch (e) {
            const errMessage = getApiErrorMessage(e);
            alert(errMessage);

            return false;
        }
    };

    const rejectApplication = async (application: BountyApplication): Promise<boolean> => {
        return await new Promise(resolve => setTimeout(resolve, 2000));

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
        <>
            <ul role="list" className="divide-y divide-theme-border dark:divide-theme-border-dark">
                {applications.map((application) => (
                    <ApplicationListItem
                        application={application}
                        openApplication={openApplication}
                        key={application.id}
                        onAccept={acceptApplication}
                        onReject={rejectApplication}
                    />
                ))}
            </ul>
            <ApplicationDetailsModal
                application={currentApplication}
                setOpen={() => {setCurrentApplication(null)}}
                onAccept={acceptApplication}
                onReject={rejectApplication}
            />
        </>
    );
};