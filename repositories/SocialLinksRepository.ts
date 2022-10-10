import {BaseRepository} from "./base/BaseRepository";
import {UserSocialLink} from "../types/supabase";
import {supabaseAdmin} from "../utils/supabase";
import {USER_SOCIAL_LINKS_TABLE} from "../utils/dbtables";

export default class SocialLinksRepository extends BaseRepository<UserSocialLink> {
    constructor() {
        const table = supabaseAdmin.from<UserSocialLink>(USER_SOCIAL_LINKS_TABLE);
        super(table, "id");
    }

    async setSocialLinks(
        userId: string,
        socialLinks: Omit<UserSocialLink, "id" | "user_id">[]
    ): Promise<UserSocialLink[]> {
        await this._table.delete().eq("user_id", userId);
        const links = socialLinks.map((link) => ({
            platform: link.platform,
            username: link.username,
            user_id: userId
        }));
        const {data, error} = await this._table.insert(links);
        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    async getSocialLinks(userId: string): Promise<UserSocialLink[]> {
        const {data, error} = await this._table.select("*").eq("user_id", userId);
        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
}