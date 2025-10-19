import type { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";

export async function getUsers(query: UserListQuery, sb: SupabaseClient):
Promise<PaginatedListResponse<User>>{

    const _query = sb
    .from("profileusers")
    .select("*", {count: "exact"})

    const {data, count, error} = await _query;

    return {
        data: (data ?? []) as [],
        count: count ?? 0,
        limit: query.limit ?? 20,
        offset: query.offset ?? 0,
    };

}

export async function createUser (sb: SupabaseClient , user: NewUser): 
Promise<User> {
    const query = sb.from("profileusers").insert(user).select().single();
    const response: PostgrestSingleResponse<User> = await query
    

    if (response.error) {
        throw new Error(response.error.message);
    }
    return response.data;
}