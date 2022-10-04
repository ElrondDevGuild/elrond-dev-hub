import {BaseRepository} from "./base/BaseRepository";
import {BountyResource} from "../types/supabase";
import {supabaseAdmin} from "../utils/supabase";
import {BOUNTY_RESOURCES_TABLE} from "../utils/dbtables";

export default class BountyResourceRepository extends BaseRepository<BountyResource> {
    constructor() {
        const table = supabaseAdmin.from<BountyResource>(BOUNTY_RESOURCES_TABLE);
        super(table, "id");
    };

    async listByBountyId(bountyId: string) {
        const {data, error} = await this._table.select("*, user:user_id(*)")
            .eq("bounty_id", bountyId);
        if (error) {
            throw error;
        }

        return data;
    }

}