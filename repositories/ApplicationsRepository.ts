import {BaseRepository} from "./base/BaseRepository";
import {BountyApplication} from "../types/supabase";
import {supabaseAdmin} from "../utils/supabase";
import {BOUNTY_APPLICATIONS_TABLE} from "../utils/dbtables";

export default class ApplicationsRepository extends BaseRepository<BountyApplication> {
    constructor() {
        const table = supabaseAdmin.from<BountyApplication>(BOUNTY_APPLICATIONS_TABLE);
        super(table, "id");
    }
};