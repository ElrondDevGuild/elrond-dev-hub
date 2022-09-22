import {BaseRepository} from "./base/BaseRepository";
import {Bounty} from "../types/supabase";
import {supabaseAdmin} from "../utils/supabase";
import {BOUNTIES_TABLE} from "../utils/dbtables";

export default class BountyRepository extends BaseRepository<Bounty> {
    constructor() {
        const table = supabaseAdmin.from<Bounty>(BOUNTIES_TABLE);
        super(table, "id");
    }
};