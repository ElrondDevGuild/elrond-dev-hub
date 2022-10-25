import {useAuth} from "../../hooks/useAuth";
import {useMemo} from "react";
import {useRouter} from "next/router";
import DropDown from "../shared/DropDown";
import ProfileImage from "./ProfileImage";

export default function UserIconMenu() {
    const {user, loading, logout} = useAuth();
    const router = useRouter();
    const menuOptions = useMemo(() => {
        if (loading) {return [];}
        if (!user) {
            return [
                {label: "Sign In", onClick: async () => {await router.push("/auth")}},
            ];
        }
        return [
            {label: "My Profile", onClick: async () => {await router.push(`/profile/${user?.id}`)}},
            {label: "Settings", onClick: async () => {await router.push("/profile/settings")}},
            {
                label: "Sign out", onClick: async () => {
                    logout();
                    await router.push("/")
                }
            },
        ];
    }, [user, loading]);


    return <DropDown
        options={menuOptions}
        positionY={"bottom"}
        openOptions={{
            icon: <ProfileImage avatarUrl={user?.avatar_url || ""} size="md"/>
        }}
    />


};