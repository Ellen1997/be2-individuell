import type { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";
import type { User, NewUser, UserListQuery } from "../../../types/users.js";
import type { PaginatedListResponse } from "../../../types/general.js"

export async function getUsers(query: UserListQuery, sb: SupabaseClient):
Promise<PaginatedListResponse<User>>{

    const _query = sb
    .from("profileusers")
    .select(`
      *,
      bookings (
          booking_id,
            start_date,
            end_date,
            total_price 
            , properties (
                property_name )
                )`, {count: "exact"})

    const users: PostgrestSingleResponse<User[]> = await _query;

    return {
        data: users.data || [],
        count: users.count ?? 0,
        limit: query.limit ?? 20,
        offset: query.offset ?? 0,
    };

}

export async function getUser(sb: SupabaseClient,
    id: string ): Promise<Partial<User>> {
    const _query = sb
    .from("profileusers")
    .select(`
      *,
      bookings (
          booking_id,
            start_date,
            end_date,
            total_price 
            , properties (
                property_name )
                )`)
    .eq("profileuser_id", id)
    .single();

    const users: PostgrestSingleResponse<User> = await _query;
    return users.data ?? {};

    }



//Nedan ska inte användas egentligen i.o.m auth/register, denna kan
//vara kvar ifall admin vill skapa användare eftersom database å route 
//redan uppsatt, men ska ej anvädnas (DEN FÅR INGEN USER-GREJ I SUPABASE)

export async function createUser (sb: SupabaseClient , user: NewUser): 
Promise<User> {
    const query = sb.from("profileusers").insert(user).select().single();
    const response: PostgrestSingleResponse<User> = await query
    

    if (response.error) {
        throw new Error(response.error.message);
    }
    return response.data;
}