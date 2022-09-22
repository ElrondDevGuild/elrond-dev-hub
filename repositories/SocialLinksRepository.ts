import {BaseRepository} from "./base/BaseRepository";
import {UserSocialLink} from "../types/supabase";
import {supabaseAdmin} from "../utils/supabase";
import {USER_SOCIAL_LINKS_TABLE} from "../utils/dbtables";

export default class SocialLinksRepository extends BaseRepository<UserSocialLink> {
    constructor() {
        const table = supabaseAdmin.from<UserSocialLink>(USER_SOCIAL_LINKS_TABLE);
        super(table, "id");
    }
}