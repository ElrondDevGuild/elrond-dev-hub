import {BaseRepository} from "./base/BaseRepository";
import {User} from "../types/supabase";
import {USERS_TABLE} from "../utils/dbtables";
import {supabaseAdmin} from "../utils/supabase";

export default class UserRepository extends BaseRepository<User> {
    constructor() {
        const table = supabaseAdmin.from<User>(USERS_TABLE);
        super(table, "id");
    }

    async findOrCreate(wallet: string): Promise<User> {
        const user = await this.findById(wallet);
        if (user) {
            return user;
        }

        const {error, data} = await this.create({
            wallet,
            avatar_url: null,
            description: null,
            name: null,
        });

        if (error || !data) {
            throw new Error(error?.message || 'Failed to create item');
        }

        return data;

    }

};