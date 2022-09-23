import {BaseRepository} from "./base/BaseRepository";
import {Bounty, BountyTag, Tag} from "../types/supabase";
import {BOUNTY_TAG_PIVOT_TABLE} from "../utils/dbtables";
import {supabaseAdmin} from "../utils/supabase";

export default class BountyTagRepository extends BaseRepository<BountyTag> {
    constructor() {
        const table = supabaseAdmin.from<BountyTag>(BOUNTY_TAG_PIVOT_TABLE);
        super(table, "id");
    }

    async assignBountyTags(bounty: Bounty, tags: Tag[]): Promise<Bounty> {
        const {data, error} = await this._table.insert(tags.map(tag => ({
            tag_id: tag.id,
            bounty_id: bounty.id
        })), {returning: "minimal"});

        if (error) {throw error;}

        // @ts-ignore
        bounty.tags = tags;

        return bounty;
    }
};