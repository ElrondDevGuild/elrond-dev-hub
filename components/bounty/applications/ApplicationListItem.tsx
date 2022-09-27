import {BountyApplication} from "../../../types/supabase";
import {useState} from "react";
import UserRating from "../../UserRating";
import {BsCheck, BsX} from "react-icons/bs";
import DropDown from "../../shared/DropDown";


export default function ApplicationListItem(
    {
        application,
        openApplication
    }: { application: BountyApplication, openApplication: (application: BountyApplication) => void }
) {
    const [loading, setLoading] = useState(false);

    const acceptApplication = (application: BountyApplication) => {
        alert("Not implemented yet");
    };

    const rejectApplication = (application: BountyApplication) => {
        alert("Not implemented yet");
    };

    const options = [
        {label: "Accept", onClick: () => acceptApplication(application)},
        {label: "Reject", onClick: () => rejectApplication(application)},
    ];

    return (
        <li key={application.id}>
            <div className="flex items-center justify-between py-2">
                <div
                    className="flex flex-col md:flex-row items-start md:items-center gap-x-6 gap-y-1 justify-between w-1/2 md:w-2/3 lg:w-1/2">
                    <p className="truncate text-sm font-medium dark:text-secondary-dark-lighter w-1/2">
                        {application.user.name}
                    </p>
                    <UserRating reviews={[]}/>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="text-sm text-theme-text dark:text-theme-text-dark"
                            onClick={() => openApplication(application)}
                    >
                        View Application
                    </button>
                    <div className="hidden lg:flex items-center space-x-2">
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
                    <div className="block lg:hidden pr-1">
                        <DropDown options={options}/>
                    </div>
                </div>
            </div>
        </li>
    );
};