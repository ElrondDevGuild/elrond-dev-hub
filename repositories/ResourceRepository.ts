import {BaseRepository} from "./base/BaseRepository";
import {MediaResource} from "../types/supabase";
import {supabaseAdmin} from "../utils/supabase";
import {RESOURCES_TABLE} from "../utils/dbtables";

export class ResourceRepository extends BaseRepository<MediaResource> {
    constructor() {
        const table = supabaseAdmin.from<MediaResource>(RESOURCES_TABLE);
        super(table, "id");
    }
}