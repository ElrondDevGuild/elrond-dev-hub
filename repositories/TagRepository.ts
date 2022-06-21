import {BaseRepository} from "./base/BaseRepository";
import {Tag} from "../types/supabase";
import {supabaseAdmin} from "../utils/supabase";
import {TAGS_TABLE} from "../utils/dbtables";


export class TagRepository extends BaseRepository<Tag> {
    constructor() {
        const table = supabaseAdmin.from<Tag>(TAGS_TABLE);
        super(table, "id");
    }

    async createNotExisting(tags: string[]): Promise<Tag[]> {
        const {data: existingTags, error} = await this._table.select().in("title", tags);
        if (error) {throw error;}
        const existingTagTitles = existingTags?.map(tag => tag.title);
        const newTags = tags
            .filter(tag => !existingTagTitles.includes(tag))
            .map(tag => ({title: tag}));

        const {data: createdTags, error: newTagsError} = await this._table.insert(newTags);
        if (newTagsError) {throw newTagsError;}

        return [...existingTags, ...createdTags];
    }
}