import {BaseRepository} from "./base/BaseRepository";
import {Category} from "../types/supabase";
import {supabaseAdmin} from "../utils/supabase";
import {CATEGORIES_TABLE} from "../utils/dbtables";

export class CategoryRepository extends BaseRepository<Category> {
    constructor() {
        const table = supabaseAdmin.from<Category>(CATEGORIES_TABLE);
        super(table, "id");
    }

    async getIds(): Promise<number[]> {
        const {data, error} = await this._table.select('id');
        if (error) {throw new Error(error.message);}

        return data?.map(item => item.id);
    }
}