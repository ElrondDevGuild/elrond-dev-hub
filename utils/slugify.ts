import slugify from "slugify";
import {MediaResource} from "../types/supabase";

export const createSlug = (resource: MediaResource): string => {
    return slugify(`${resource.title.toLowerCase()} ${resource.id}`);
}