import axios from "axios";

export const getMaiarAvatar = async (address: string): Promise<string | null> => {
    try {
        const {request} = await axios.get(`https://id.maiar.com/users/photos/profile/${address}`);
        return request.res.responseUrl || null;
    } catch (e) {
        return null;
    }
}