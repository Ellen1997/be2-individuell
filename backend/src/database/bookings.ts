import type { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";
import type { PaginatedListResponse } from "../../../types/general.js"
import type { Booking, NewBooking, BookingListQuery } from "../../../types/bookings.js"

export async function getBookings(query: BookingListQuery, sb: SupabaseClient): 
Promise<PaginatedListResponse<Booking>> {

  const startIndex = query.offset || 0;
  const endIndex = startIndex + (query.limit || 100) - 1;


    let _query = sb
    .from("bookings")
    .select(`
      *,
      properties (
        property_name,
        location,
        profileusers (
        name)
      ),
      profileusers (
        name,
        email,
        phone_number
      )
    `, {count: "exact"})

    _query = _query.range(startIndex, endIndex);


    const bookings: PostgrestSingleResponse<Booking[]> = await _query;

    return{
        data: bookings.data || [],
        count: bookings.count ?? 0,
        limit: query.limit ?? 30,
        offset: query.offset ?? 0,
    };
}

export async function getBooking(sb: SupabaseClient, 
    id: string
): Promise<Partial<Booking>> {

    const _query = sb
    .from("bookings")
    .select(`
      *,
      properties (
        property_name,
        location,
        profileusers (
        name)
      ),
      profileusers (
        name,
        email,
        phone_number
      )
    `)
    .eq("booking_id", id)
    .single();

    const bookings: PostgrestSingleResponse<Booking> = await _query

    return bookings.data ?? {}

}

export async function getBookingsByProperty(sb: SupabaseClient, propertyId: string): 
Promise<Booking[]> {

    const _query = sb
    .from("bookings")
    .select(`
      *,
      properties (
        property_name,
        location
      ),
      profileusers (
        name,
        email
      )
    `)
    .eq("property_id", propertyId);

    const propertybookings: PostgrestSingleResponse<Booking[]> = await _query;

    if (propertybookings.error) throw new Error(`Failed to fetch property bookings: ${propertybookings.error.message}`);
    return propertybookings.data;
}

export async function getBookingsByOwner(sb: SupabaseClient, ownerId: string): 
Promise<Booking[]> {

  const { data: properties, error: propertiesError } = await sb
    .from("properties")
    .select("property_id")
    .eq("owner_id", ownerId);

      if (propertiesError) {
    throw new Error(`Failed to fetch properties for owner: ${propertiesError.message}`);
  }

  if (!properties || properties.length === 0) {
    return [];
  }

  const propertyIds = properties.map((p) => p.property_id);

   const { data: bookings, error: bookingsError } = await sb
    .from("bookings")
    .select(`
      *,
      properties (
        property_name,
        location,
        owner_id
      ),
      profileusers (
        name,
        email
      )
    `)
    .in("property_id", propertyIds); 

  if (bookingsError) {
    throw new Error(`Failed to fetch bookings for owner's properties: ${bookingsError.message}`);
  }

  return bookings || [];
}


export async function getBookingsByUser(sb: SupabaseClient, profileuserId: string): 
Promise<Booking[]> {

  const _query = sb
    .from("bookings")
    .select(`
      *,
      properties (
        property_name,
        location,
        owner_id
      ),
      profileusers (
        name,
        email
      )
    `)
    .eq("profileuser_id", profileuserId);

    const userbookings: PostgrestSingleResponse<Booking[]> = await _query;

  if (userbookings.error) throw new Error(`Failed to fetch user bookings: ${userbookings.error.message}`);
  return userbookings.data;
}



export async function createBookings(sb: SupabaseClient, 
  booking: Omit<NewBooking, "profileuser_id"> & { profileuser_id: string }):
Promise<Booking> {

    const { data: existingBookings, error: overlapError } = await sb
    .from("bookings")
    .select("*")
    .eq("property_id", booking.property_id)
    .or(`and(start_date.lte.${booking.end_date},end_date.gte.${booking.start_date})`);

    if (overlapError) throw new Error(overlapError.message);
    if(existingBookings && existingBookings.length > 0) {
        throw new Error("Property is already booked for this period");
    }

    const { data: propertyData, error: propertyError } = await sb
    .from("properties")
    .select("pricePerNight")
    .eq("property_id", booking.property_id)
    .single();

    if (propertyError) throw new Error(propertyError.message)

    const start = new Date(booking.start_date)
    const end = new Date(booking.end_date)
    const nights = Math.ceil((end.getTime()- start.getTime()) / (1000 * 60 * 60 * 24) )

    const total_price = (propertyData.pricePerNight ?? 0) * nights;


    const query = sb.from("bookings").
    insert({...booking, total_price})
    .select(
        `*,
        properties (
         property_name,
         location,
         pricePerNight),
        profileusers (
         name,
         email,
         phone_number
         )`
    ).single();

    const response: PostgrestSingleResponse<Booking> = await query

    if(response.error) {
        throw new Error(response.error.message)
    }
    return response.data
}

export async function updateBooking( sb: SupabaseClient,
  bookingId: string,
  updates: Partial<Booking>,
  userId?: string
): Promise<Booking> {

    const { data: existingBooking, error: fetchError } = await sb
    .from("bookings")
    .select(`
      booking_id,
      property_id,
      profileuser_id,
      properties!inner(
        owner_id
      )
    `)
    .eq("booking_id", bookingId)
    .single();

  if (fetchError || !existingBooking) {
    throw new Error("Bokningen kunde inte hittas.");
  }

  const { data, error } = await sb
    .from("bookings")
    .update(updates)
    .eq("booking_id", bookingId)
    .select(
      `
      *,
      properties (
        property_name,
        location,
        owner_id
      ),
      profileusers (
        name,
        email,
        phone_number
      )
    `
    )
    .single();

  if (error) {
    throw new Error(`Failed to update booking: ${error.message}`);
  }

  return data;
}

export async function deleteBooking(
  sb: SupabaseClient,
  bookingId: string
): Promise<void> {
  const { error } = await sb
    .from("bookings")
    .delete()
    .eq("booking_id", bookingId);

  if (error) {
    throw new Error(`Failed to delete booking: ${error.message}`);
  }
}





