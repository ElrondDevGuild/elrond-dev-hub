import {BaseRepository} from "./base/BaseRepository";
import {Bounty} from "../types/supabase";
import {supabaseAdmin} from "../utils/supabase";
import {BOUNTIES_TABLE} from "../utils/dbtables";
import NotFoundError from "../errors/NotFoundError";

export default class BountyRepository extends BaseRepository<Bounty> {
    constructor() {
        const table = supabaseAdmin.from<Bounty>(BOUNTIES_TABLE);
        super(table, "id");
    }

    async paginate(
        {
            page,
            size,
            tags,
            owner,
            withApplications,
        }: {
            page?: number;
            size?: number;
            tags?: number[];
            owner?: string;
            withApplications?: boolean;
        } = {}
    ) {
        const {from, to} = BountyRepository.computePageRange({page, size});
        const filterTags = tags?.length ? "!inner" : "";
        let selectQuery = `
           *,
           owner:owner_id(*),
           tags:bounty_tag${filterTags}(tag_id,details:tags(id, title))
        `;
        if (withApplications) {
            selectQuery += `
                ,applications:bounty_applications(*)
            `;
        }

        let query = this._table.select(selectQuery, {count: "exact"})
            .is("deleted_at", null)
            .order("created_at", {ascending: false})
            .range(from, to);


        if (tags?.length) {
            // @ts-ignore
            query = query.in("bounty_tag.tag_id", tags);
        }
        if (owner) {
            query = query.eq("owner_id", owner);
        }


        const {data, error, count} = await query;
        if (error) {
            throw error;
        }

        return {data, count};

    }

    async findOrFail(id: string): Promise<Bounty> {
        const bounty = await this.findById(id, [
            "owner:owner_id(*, social_links:user_social_links(*))",
            "tags:bounty_tag(tag_id,details:tags(id, title))"
         ]);
        if (null === bounty || bounty.deleted_at) {
            throw new NotFoundError("bounty");
        }
        return bounty;
    }
};