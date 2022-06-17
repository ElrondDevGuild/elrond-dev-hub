import {createClient} from '@supabase/supabase-js';

// @ts-ignore
export const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET);

