import {IRead, IWrite} from '../../types/repository';
import {PostgrestResponse, PostgrestSingleResponse} from '@supabase/supabase-js';
import {SupabaseQueryBuilder} from "@supabase/supabase-js/dist/module/lib/SupabaseQueryBuilder";
import {PostgrestFilterBuilder} from "@supabase/postgrest-js";



interface InsertOptions {
    returning?: "minimal" | "representation";
    count?: null | "exact" | "planned" | "estimated";
}

export abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {
    protected readonly _table: SupabaseQueryBuilder<T>;
    protected readonly _idField?: keyof T;
    protected readonly perPage: number = 20;

    constructor(table: SupabaseQueryBuilder<T>, idField?: keyof T) {
        this._table = table;
        this._idField = idField;
    }

    async create(item: Omit<T, 'id'>, options?: InsertOptions): Promise<PostgrestSingleResponse<T>> {
        if (options) {
            return await this._table.insert(item as T, options).single();
        }
        return await this._table.insert(item as T).single();
    }

    async createMany(
        items: Array<Partial<T>>,
        options?: InsertOptions
    ): Promise<PostgrestResponse<T>> {
        if (options) {
            return this._table.insert(items, options);
        }

        return this._table.insert(items);

    }

    async update(id: T[keyof T], item: Partial<T>): Promise<PostgrestResponse<T>> {
        if (!this._idField) throw new Error("Unique ID not provided.");

        return this._table.update(item).eq(this._idField, id);
    }

    async delete(id: T[keyof T]): Promise<boolean> {
        if (!this._idField) throw new Error("Unique ID not provided.");

        const data = await this._table.delete().eq(this._idField, id);
        return !!data;
    }

    findById(id: T[keyof T]): PromiseLike<PostgrestSingleResponse<T>> {
        if (!this._idField) throw new Error("Unique ID not provided.");

        return this._table.select("*").eq(this._idField, id).single();
    }

    all(columns?: string): PostgrestFilterBuilder<T> {
        return this._table.select(columns);
    }
}
