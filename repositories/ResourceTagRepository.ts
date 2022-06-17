import {BaseRepository} from "./base/BaseRepository";
import {ResourceTag} from "../types/supabase";
import {supabaseAdmin} from "../utils/supabase";
import {RESOURCE_TAG_PIVOT_TABLE} from "../utils/dbtables";


export class ResourceTagRepository extends BaseRepository<ResourceTag> {
    constructor() {
        const table = supabaseAdmin.from<ResourceTag>(RESOURCE_TAG_PIVOT_TABLE);
        super(table, "id");
    }
}