import type { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";
import { property } from "zod";

export async function getProperties(query: PropertyListQuery, sb: SupabaseClient):
Promise<PaginatedListResponse<Property>>{

    const _query = sb
    .from("properties")
    .select("*", {count: "exact"})

    const {data, count, error} = await _query;

    return {
        data: (data ?? []) as [],
        count: count ?? 0,
        limit: query.limit ?? 20,
        offset: query.offset ?? 0,

    };
}

export async function createProperty(sb: SupabaseClient, property: NewProperty):
Promise<Property> {
    const query = sb.from("properties").insert(property).select().single();
    const response: PostgrestSingleResponse<Property> = await query

    if (response.error) {
        throw new Error(response.error.message);
    }
    return response.data;
    
}