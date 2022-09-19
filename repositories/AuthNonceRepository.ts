import {BaseRepository} from "./base/BaseRepository";
import {AuthNonce} from "../types/supabase";
import {AUTH_NONCES_TABLE} from "../utils/dbtables";
import {supabaseAdmin} from "../utils/supabase";

export default class AuthNonceRepository extends BaseRepository<AuthNonce> {
    constructor() {
        const table = supabaseAdmin.from<AuthNonce>(AUTH_NONCES_TABLE);
        super(table, "id");
    }

};