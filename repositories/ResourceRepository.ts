import {BaseRepository} from "./base/BaseRepository";
import {MediaResource} from "../types/supabase";
import {supabaseAdmin} from "../utils/supabase";
import {RESOURCES_TABLE} from "../utils/dbtables";

export class ResourceRepository extends BaseRepository<MediaResource> {
    constructor() {
        const table = supabaseAdmin.from<MediaResource>(RESOURCES_TABLE);
        super(table, "id");
    }

    async paginate({page, size, categories, tags}: {
        page?: number,
        size?: number,
        categories?: number[],
        tags?: number[]
    } = {}) {
        const {from, to} = ResourceRepository.computePageRange({page, size});

        let query = this._table.select(`
            *,
            tags(id, title),
            category:category_id(id, title),
            resource_tag!inner(tag_id)
        `).range(from, to);

        if (categories?.length) {
            query = query.in("category_id", categories);
        }

        if (tags?.length) {
            // @ts-ignore
            query = query.in("resource_tag.tag_id", tags);
        }

        const {data, error} = await query;
        if (error) {throw error;}

        return data;

    }
}