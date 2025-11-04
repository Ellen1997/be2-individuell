import type { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";
import type { Property, NewProperty, PropertyListQuery } from "../../../types/property.js"
import type { PaginatedListResponse } from "../../../types/general.js"

export async function getProperties(query: PropertyListQuery, sb: SupabaseClient):
Promise<PaginatedListResponse<Property>>{

  const startIndex = query.offset || 0;
  const endIndex = startIndex + (query.limit || 10) - 1;

    let _query = sb
    .from("properties")
    .select("*", {count: "exact"})

     if (query.location) {
    _query = _query.ilike("location", `%${query.location}%`);
  }

  if (query.minPrice !== undefined) {
    _query = _query.gte("pricePerNight", query.minPrice);
  }

  if (query.maxPrice !== undefined) {
    _query = _query.lte("pricePerNight", query.maxPrice);
  }

  if (query.sort) {
    if (query.sort === "price_asc") {
      _query = _query.order("pricePerNight", { ascending: true });
    } else if (query.sort === "price_desc") {
      _query = _query.order("pricePerNight", { ascending: false });
    } else if (query.sort === "newest") {
      _query = _query.order("created_at", { ascending: false });
    }
  }

  _query = _query.range(startIndex, endIndex);

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

export async function updateProperty(
  sb: SupabaseClient,
  id: string,
  updatedProperty: Partial<Property>
): Promise<Property> {
  const query = sb
    .from("properties")
    .update(updatedProperty)
    .eq("property_id", id)
    .select()
    .single();

  const response: PostgrestSingleResponse<Property> = await query;

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
}


export async function patchProperty(
  sb: SupabaseClient,
  id: string,
  fields: Partial<Property>
): Promise<Property> {

    const payload = Object.fromEntries(
    Object.entries(fields).filter(([_, v]) => v !== undefined)
  );

  const query = sb
    .from("properties")
    .update(payload)
    .eq("property_id", id)
    .select()
    .single();

  const response: PostgrestSingleResponse<Property> = await query;

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
}

export async function deleteProperty(
  sb: SupabaseClient,
  id: string
): Promise<void> {
  const query = sb.from("properties").delete().eq("property_id", id);
  const response = await query;

  if (response.error) {
    throw new Error(response.error.message);
  }
}