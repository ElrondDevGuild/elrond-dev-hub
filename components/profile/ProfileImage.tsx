import {User} from "../../types/supabase";
import {HiUserCircle} from "react-icons/hi"
import Image from "next/image";
import {classNames} from "../../utils/presentation";

type Size = "sm" | "md" | "lg";
export default function ProfileImage(
    {
        user,
        size = "md"
    }: { user: User, size?: Size }
) {
    const pxSize = getPxSize(size);
    if (!user.avatar_url) {
        return (
            <HiUserCircle
                className={classNames(
                    getClassSizes(size),
                    "text-theme-text dark:text-theme-text-dark"
                )}
            />
        );
    }

    return (
        <Image
            src={user.avatar_url}
            width={pxSize}
            height={pxSize}
            className="rounded-full"
            alt="profile picture"
        />
    );
};

const getPxSize = (size: Size) => {
    switch (size) {
        case "sm":
            return 16;
        case "md":
            return 32;
        default:
            return 64;
    }
};
const getClassSizes = (size: Size) => {
    switch (size) {
        case "sm":
            return "w-[16px] h-[16px]";
        case "md":
            return "w-[32px] h-[32px]";
        default:
            return "w-[64px] h-[64px]";
    }
}
