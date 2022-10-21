import axios from "axios";
import {User, UserSocialLink} from "../types/supabase";

export const getMaiarAvatar = async (address: string): Promise<string | null> => {
    try {
        const {request} = await axios.get(`https://id.maiar.com/users/photos/profile/${address}`);
        return request.res.responseUrl || null;
    } catch (e) {
        return null;
    }
};

export const getUserHandle = (user: User): string => {
    if (user.handle) {
        return `@${user.handle}`;
    }

    return user.wallet.substring(0, 4) + "..." + user.wallet.substring(user.wallet.length - 4);

}

export const isProfileComplete = (user: User): boolean => {
    if (!user.name || !user.social_links || user.social_links.length < 2) {return false;}

    return hasRequiredSocialAccounts(user.social_links);
}

export const hasRequiredSocialAccounts = (socialLinks: UserSocialLink[]): boolean => {
    const hasSocialAccount = socialLinks.some(
        ({platform}) => ["twitter", "linkedin"].includes(platform)
    );

    if (!hasSocialAccount) {return false;}

    return socialLinks.some(
        ({platform}) => ["telegram", "discord"].includes(platform)
    );
};