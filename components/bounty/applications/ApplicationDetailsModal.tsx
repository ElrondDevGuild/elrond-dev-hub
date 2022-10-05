import {BountyApplication} from "../../../types/supabase";
import Popup from "../../shared/Dialog";
import UserRating from "../../UserRating";
import {BsCheck, BsX} from "react-icons/bs";

export default function ApplicationDetailsModal(
    {
        application,
        setOpen,
    }: { application: BountyApplication | null, setOpen: (value: boolean) => void }
) {
    const acceptApplication = (application: BountyApplication) => {
        alert("Not implemented yet");
    };
    const rejectApplication = (application: BountyApplication) => {
        alert("Not implemented yet");
    };

    if (!application) {
        return null;
    }

    return (
        <Popup open={true} setOpen={setOpen}>
            <div className="flex flex-col w-full items-start px-4 gap-y-8">
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
                    <button className="text-sm text-theme-text dark:text-secondary underline"
                            onClick={() => {}}
                    >
                        View Profile
                    </button>
                    <div className="flex items-center space-x-4">
                        <button
                            className="flex items-center text-sm text-primary-dark hover:underline"
                            onClick={() => acceptApplication(application)}
                        >
                            <BsCheck className="w-4 h-4"/>
                            <span>Accept</span>
                        </button>
                        <button
                            className="flex items-center text-sm text-red-500 hover:underline"
                            onClick={() => rejectApplication(application)}
                        >
                            <BsX className="w-4 h-4"/>
                            <span>Reject</span>
                        </button>
                    </div>
                </div>
            </div>
        </Popup>
    );
};