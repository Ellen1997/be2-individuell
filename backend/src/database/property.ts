import type { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";
import type { Property, NewProperty, PropertyListQuery } from "../../../types/property.js"
import type { PaginatedListResponse } from "../../../types/general.js"

export async function getProperties(query: PropertyListQuery, sb: SupabaseClient):
Promise<PaginatedListResponse<Property>>{

  const startIndex = query.offset || 0;
  const endIndex = startIndex + (query.limit || 10) - 1;

    const _query = sb
    .from("properties")
    .select("*", {count: "exact"})

    const properties: PostgrestSingleResponse<Property[]> = await _query;

    return {
        data: properties.data || [],
        count: properties.count ?? 0,
        limit: query.limit ?? 20,
        offset: query.offset ?? 0,

    };
}

export async function getProperty(sb: SupabaseClient,
    id: string
): Promise<Partial<Property>> {

    const _query = sb
    .from("properties")
    .select("*", {count: "exact"})
    .eq("property_id", id)
    .single();

    const properties: PostgrestSingleResponse<Property> = await _query;

    return properties.data ?? {}

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