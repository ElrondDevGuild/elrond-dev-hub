import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Layout from "../../components/Layout";
import RequiresAuth from "../../components/RequiresAuth";
import {Bounty, BountyApplication, BountyResource} from "../../types/supabase";
import Loader from "../../components/shared/Loader";
import {api} from "../../utils/api";
import axios from "axios";
import UserRating from "../../components/UserRating";
import Button from "../../components/shared/Button";
import Moment from "react-moment";
import {ucFirst} from "../../utils/presentation";
import {useAuth} from "../../hooks/useAuth";
import ApplicationsList from "../../components/bounty/applications/ApplicationsList";
import ResourceItem from "../../components/bounty/resources/ResourceItem";
import ApplicationWorkModal from "../../components/bounty/applications/ApplicationWorkModal";
import {bountyPath} from "../../utils/routes";

export default function BountyDetails() {
    const [bounty, setBounty] = useState<Bounty | null>(null);
    const [bountyResources, setBountyResources] = useState<BountyResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [showApplicationWorkModal, setShowApplicationWorkModal] = useState(false);
    const [currentApplication, setCurrentApplication] = useState<BountyApplication | null>(null);
    const router = useRouter();
    const {user} = useAuth();

    const getBounty = async (id: string) => {
        try {
            const {data: bounty} = await api.get(`bounties/${id}`);
            setBounty(bounty);
        } catch (e) {
            if (axios.isAxiosError(e) && e.response?.status === 404) {
                router.push("/404");
            }
        } finally {
            setLoading(false);
        }
    };
    const getBountyResources = async (id: string) => {
        try {
            const {data: bountyResources} = await api.get(`bounties/${id}/resources`);
            setBountyResources(bountyResources);
        } catch (e) {

        }
    };
    const getCurrentUserApplication = async () => {
        try {
            if (!user || !bounty) {
                return;
            }
            const {data: application} = await api.get(`bounties/${bounty.id}/applications/current`);
            setCurrentApplication(application);
        } catch (e) {
            setCurrentApplication(null);
        }
    }

    useEffect(() => {
        if (!router.isReady) {
            return;
        }
        const {id} = router.query;
        getBounty(id as string);

    }, [router]);

    useEffect(() => {
        if (!bounty) {
            return;
        }
        getBountyResources(bounty.id);
    }, [bounty]);

    useEffect(() => {
        getCurrentUserApplication();
    }, [bounty, user]);

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
                <div className="flex flex-col w-full pl-6">
                    <div
                        className="flex justify-between py-6 flex-col sm:flex-row"
                    >
                        <div
                            className="text-theme-title dark:text-theme-title-dark font-semibold text-2xl order-last sm:order-first pr-6 sm:pr-0">
                            <h1 className="max-w-2xl">
                                {bounty.title}
                            </h1>
                        </div>
                        <div
                            className="font-semibold text-sm  flex-shrink-0 w-1/3 self-end sm:w-auto sm:self-start pb-4 sm:pb-0">
                            <div
                                className="text-secondary bg-theme-text dark:bg-theme-text-dark dark:text-secondary-dark-lighter py-1 px-6">
                                {bounty.value} USDC
                            </div>
                        </div>
                    </div>
                    <div
                        className="flex items-center space-x-3 overflow-x-auto scrollbar-thin scrollbar-thumb-secondary dark:scrollbar-thumb-scrollbar-dark pb-2">
                        {bounty.tags?.map(tag => (
                            <span
                                key={tag.details.id}
                                className="text-sm text-primary dark:text-primary-dark"
                            >
                                #{tag.details.title}
                            </span>
                        ))}
                    </div>
                    <div className="flex items-end justify-between">
                        <div className="flex flex-col items-start mt-4 font-semibold text-sm">
                            <span className="text-xs text-primary dark:text-primary-dark uppercase">bounty owner</span>
                            <div className="flex items-center space-x-2 mt-1">
                                <span
                                    className="text-theme-text dark:text-theme-text-dark">{bounty.owner.name}</span>
                                {bounty.owner.verified && (
                                    <img src="/verified_icon.svg" className="mr-1"/>
                                )}
                            </div>
                            <UserRating reviews={[]}/>
                        </div>
                        <div className="flex items-center space-x-2">
                            <BountyAction
                                bounty={bounty}
                                currentApplication={currentApplication}
                                user={user}
                                setShowApplicationWorkModal={setShowApplicationWorkModal}
                            />
                            <Button
                                label="Share"
                                theme="secondary"
                                onClick={() => {
                                    alert("share")
                                }}/>
                        </div>
                    </div>
                    <hr className="w-full h-0.5 bg-theme-border dark:bg-theme-border-dark my-5"/>
                    <div
                        className="grid grid-cols-2 md:grid-cols-3 gap-y-6 justify-items-center md:justify-items-start text-sm font-semibold">
                        <div className="flex flex-col items-center md:items-start space-y-1">
                            <span className="text-theme-text dark:text-theme-text-dark uppercase">Creation Date</span>
                            <span className="text-primary dark:text-primary-dark">
                               <Moment fromNow>{bounty.created_at}</Moment>
                            </span>
                        </div>
                        <div className="flex flex-col items-center md:items-start space-y-1">
                            <span
                                className="text-theme-text dark:text-theme-text-dark uppercase">Status</span>
                            <span className="text-primary dark:text-primary-dark">
                                {ucFirst(bounty.status.replace("_", " "))}
                            </span>
                        </div>
                        <div className="flex flex-col items-center md:items-start space-y-1">
                            <span className="text-theme-text dark:text-theme-text-dark uppercase">Issue Type</span>
                            <span className="text-primary dark:text-primary-dark">
                                {ucFirst(bounty.issue_type)}
                            </span>
                        </div>

                        <div className="flex flex-col items-center md:items-start space-y-1">
                            <span className="text-theme-text dark:text-theme-text-dark uppercase">Project type</span>
                            <span className="text-primary dark:text-primary-dark">
                              {ucFirst(bounty.project_type.replace("_", " "))}
                            </span>
                        </div>
                        <div className="flex flex-col items-center md:items-start space-y-1">
                            <span
                                className="text-theme-text dark:text-theme-text-dark uppercase">Permissions</span>
                            <span className="text-primary dark:text-primary-dark">
                                {bounty.requires_work_permission ? "Required" : "Permissionless"}
                            </span>
                        </div>
                        <div className="flex flex-col items-center md:items-start space-y-1">
                            <span
                                className="text-theme-text dark:text-theme-text-dark uppercase">Experience</span>
                            <span className="text-primary dark:text-primary-dark">
                                {ucFirst(bounty.experience_level)}
                            </span>
                        </div>
                    </div>
                    <hr className="w-full h-0.5 bg-theme-border dark:bg-theme-border-dark my-5"/>
                    <h3 className="text-theme-text dark:text-theme-text-dark font-semibold">Description</h3>
                    <div className="text-sm mt-4 text-theme-text dark:text-white"
                         dangerouslySetInnerHTML={{__html: bounty.description}}></div>

                    <hr className="w-full h-0.5 bg-theme-border dark:bg-theme-border-dark my-5"/>
                    <h3 className="text-theme-text dark:text-theme-text-dark font-semibold">Acceptance
                        Criteria</h3>
                    <div className="text-sm mt-4 text-theme-text dark:text-white"
                         dangerouslySetInnerHTML={{__html: bounty.acceptance_criteria}}></div>
                    <hr className="w-full h-0.5 bg-theme-border dark:bg-theme-border-dark my-5"/>
                    <h3 className="text-theme-text dark:text-theme-text-dark font-semibold">Resources</h3>
                    <div className="flex items-start gap-6 mb-4 flex-wrap mt-4">
                        {bountyResources.map(resource => (
                            <ResourceItem key={resource.id} resource={resource}/>
                        ))}
                    </div>
                    <hr className="w-full h-0.5 bg-theme-border dark:bg-theme-border-dark my-5"/>
                    {bounty.owner_id === user?.id && (
                        <>
                            <h3 id="applications" className="text-theme-text dark:text-theme-text-dark font-semibold">Applicants</h3>
                            <ApplicationsList bounty={bounty}/>
                        </>
                    )}

                </div>
                <ApplicationWorkModal
                    open={showApplicationWorkModal}
                    setOpen={setShowApplicationWorkModal}
                    bountyId={bounty.id}
                    onSuccess={async () => { await getCurrentUserApplication()}}
                />
            </RequiresAuth>
        </Layout>
    );
};

function BountyAction({bounty, user, currentApplication, setShowApplicationWorkModal}: any) {
    const router = useRouter();

    if (bounty.owner_id === user?.id) {
        return <Button
            label="Edit"
            onClick={() => router.push(bountyPath(bounty.id, "edit"))}
        />
    }

    if (currentApplication) {
        return <Button
            label="My Application"
            onClick={() => alert("Not Implemented")}
        />
    }

    return <Button
        label="Start Work"
        onClick={() => setShowApplicationWorkModal(true)}
    />
}