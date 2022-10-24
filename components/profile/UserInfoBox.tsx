import {useAuth} from "../../hooks/useAuth";
import ProfileImage from "./ProfileImage";
import DropDown, {DropdownOption} from "../shared/DropDown";
import {useRouter} from "next/router";
import {getUserHandle} from "../../utils/profile";
import {profilePath} from "../../utils/routes";

export default function UserInfoBox() {
    const {user, logout} = useAuth();
    const router = useRouter();
    const menuOptions: DropdownOption[] = [
        {label: "My Profile", onClick: async () => {await router.push(`/profile/${user?.id}`)}},
        {label: "Settings", onClick: async () => {await router.push("/profile/settings")}},
        {
            label: "Sign out", onClick: async () => {
                logout();
                await router.push("/")
            }
        },
    ];

    if (!user) {
        return null;
    }

    return (
        <div
            className="w-full h-20 flex items-center justify-between pr-3 bg-secondary dark:bg-secondary-dark border-t border-b border-theme-border dark:border-theme-border-dark"
        >
            <button
                className="flex items-center overflow-hidden"
                onClick={() => router.push(`${profilePath}/${user.id}`)}
            >
                <ProfileImage avatarUrl={user.avatar_url} size="lg"/>
                <div className="flex flex-col items-start ml-2 space-y-1 ">
                    <div className="flex items-center space-x-2">
                    <span
                        className="text-sm text-theme-title dark:text-theme-title-dark font-semibold"
                    >
                        {user.name}
                    </span>
                        {user.verified && (
                            <img src="/verified_icon.svg" className="mr-1"/>
                        )}
                    </div>
                    <span
                        className="text-sm text-theme-text dark:text-theme-text-dark text-clip overflow-hidden"
                    >
                        {getUserHandle(user)}
                    </span>

                </div>
            </button>
            <DropDown options={menuOptions} positionY={"top"}/>
        </div>
    );
};