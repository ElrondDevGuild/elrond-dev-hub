import {BaseRepository} from "./base/BaseRepository";
import {Tag} from "../types/supabase";
import {supabaseAdmin} from "../utils/supabase";
import {TAGS_TABLE} from "../utils/dbtables";


export class TagRepository extends BaseRepository<Tag> {
    constructor() {
        const table = supabaseAdmin.from<Tag>(TAGS_TABLE);
        super(table, "id");
    }
}