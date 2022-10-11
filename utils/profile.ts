import axios from "axios";
import {User} from "../types/supabase";

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