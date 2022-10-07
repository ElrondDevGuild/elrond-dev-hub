import {BountyApplication} from "../../../types/supabase";
import Popup from "../../shared/Dialog";
import UserRating from "../../UserRating";
import {BsCheck, BsX} from "react-icons/bs";
import {useState} from "react";
import {classNames} from "../../../utils/presentation";

export default function ApplicationDetailsModal(
    {
        application,
        setOpen,
        onAccept,
        onReject
    }: {
        application: BountyApplication | null,
        setOpen: (value: boolean) => void,
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

    if (!application) {
        return null;
    }

    return (
        <Popup open={true} setOpen={(value) => {
            if (!loading) {setOpen(value);}
        }}>
            <div className={(classNames(
                "flex flex-col w-full items-start px-4 gap-y-8",
                loading ? "animate-pulse" : ""
            ))}>
                <div
                    className="flex flex-col items-start gap-x-6 gap-y-1  w-1/2">
                    <p className="truncate text-sm font-medium dark:text-secondary w-1/2">
                        {application.user.name || "Test name"}
                    </p>
                    <UserRating reviews={[]}/>
                </div>
                <p className="flex-1 block w-full focus:outline-none text-theme-text dark:text-secondary border-0 focus-within:ring-0 autofill:bg-transparent font-medium text-sm">
                    {application.message}
                </p>
                <div className="flex items-center space-x-4">
                    <button
                        className="text-sm text-theme-text dark:text-secondary underline"
                        onClick={() => {}}
                        disabled={loading}

                    >
                        View Profile
                    </button>
                    <div className="flex items-center space-x-4">
                        {application.approval_status === "accepted" &&
                            <span className="text-primary-dark">
                                 Accepted
                            </span>
                        }
                        {application.approval_status === "rejected" &&
                            <span className="text-red-500">
                                 Rejected
                            </span>
                        }
                        {application.approval_status === "pending" && (
                        <>
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
                        </>
                    )}
                    </div>
                </div>
            </div>
        </Popup>
    );
};