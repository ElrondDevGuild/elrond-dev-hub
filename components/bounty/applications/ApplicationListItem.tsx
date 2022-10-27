import {BountyApplication, ItemWithUserRating} from "../../../types/supabase";
import {useState} from "react";
import UserRating from "../../UserRating";
import {BsCheck, BsX} from "react-icons/bs";
import DropDown from "../../shared/DropDown";
import {classNames} from "../../../utils/presentation";
import {IoEllipsisVertical} from "react-icons/io5";
import {getUserHandle} from "../../../utils/profile";
import ApplicationStatusInfo from "./ApplicationStatusInfo";


export default function ApplicationListItem(
    {
        application,
        openApplication,
        onAccept,
        onReject
    }: {
        application: ItemWithUserRating<BountyApplication>,
        openApplication: (application: BountyApplication) => void,
        onAccept: (application: BountyApplication) => Promise<boolean>,
        onReject: (application: BountyApplication) => Promise<boolean>,
    }
) {
    const [loading, setLoading] = useState(false);

    const acceptApplication = async (application: BountyApplication) => {
        setLoading(true);
        await onAccept(application);
        setLoading(false);
    };

    const rejectApplication = async (application: BountyApplication) => {
        setLoading(true);
        await onReject(application);
        setLoading(false);
    };

    const options = [
        {label: "Accept", onClick: () => acceptApplication(application)},
        {label: "Reject", onClick: () => rejectApplication(application)},
    ];

    return (
        <li key={application.id}>
            <div className={classNames(
                "flex items-center justify-between py-2",
                loading ? "animate-pulse" : ""
            )}>
                <div
                    className="flex flex-col md:flex-row items-start md:items-center gap-x-6 gap-y-1  w-1/2 md:w-2/3 lg:w-1/2">
                    <p className="truncate text-sm font-medium dark:text-secondary w-1/2">
                        {application.user.name || getUserHandle(application.user)}
                    </p>
                    <UserRating
                        rating={application.user.ratings.applications}
                        userId={application.user_id}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        className="text-sm text-theme-text dark:text-theme-text-dark"
                        onClick={() => openApplication(application)}
                        disabled={loading}
                    >
                        View Application
                    </button>
                    <ApplicationStatusInfo application={application}/>
                    {application.approval_status === "pending" && (
                        <>
                            <div className="hidden lg:flex items-center space-x-2">
                                <button
                                    className="flex items-center text-sm text-primary-dark hover:underline disabled:text-gray-400"
                                    onClick={() => acceptApplication(application)}
                                    disabled={loading}
                                >
                                    <BsCheck className="w-4 h-4"/>
                                    <span>Accept</span>
                                </button>
                                <button
                                    className="flex items-center text-sm text-red-500 hover:underline disabled:text-gray-400"
                                    onClick={() => rejectApplication(application)}
                                    disabled={loading}
                                >
                                    <BsX className="w-4 h-4"/>
                                    <span>Reject</span>
                                </button>
                            </div>
                            <div className="block lg:hidden pr-1">
                                {loading ? (
                                    <div className="relative inline-block text-left">
                                        <IoEllipsisVertical className="h-5 w-5" aria-hidden="true"/>
                                    </div>
                                ) : (
                                    <DropDown options={options}/>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </li>
    );
};