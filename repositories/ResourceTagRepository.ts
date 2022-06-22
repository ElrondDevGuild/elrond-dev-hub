import {BaseRepository} from "./base/BaseRepository";
import {MediaResource, ResourceTag, Tag} from "../types/supabase";
import {supabaseAdmin} from "../utils/supabase";
import {RESOURCE_TAG_PIVOT_TABLE} from "../utils/dbtables";


export class ResourceTagRepository extends BaseRepository<ResourceTag> {
    constructor() {
        const table = supabaseAdmin.from<ResourceTag>(RESOURCE_TAG_PIVOT_TABLE);
        super(table, "id");
    }

    async assignResourceTags(resource: MediaResource, tags: Tag[]): Promise<MediaResource> {
        const {data, error} = await this._table.insert(tags.map(tag => ({
            tag_id: tag.id,
            resource_id: resource.id
        })), {returning: "minimal"});

        if (error) {throw error;}

        resource.tags = tags;

        return resource;
    }
}