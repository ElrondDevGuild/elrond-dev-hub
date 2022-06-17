import {PostgrestResponse, PostgrestSingleResponse} from '@supabase/supabase-js';


export interface IRead<T> {
    find?(item: T): Promise<T[]>;
    findById?(id: T[keyof T]): PromiseLike<PostgrestSingleResponse<T>>;
}



export interface IWrite<T> {
    create(item: T): Promise<PostgrestSingleResponse<T>>;

    update(value: T[keyof T], item: T): Promise<PostgrestResponse<T>>;

    delete(id: T[keyof T]): Promise<boolean>;
}
