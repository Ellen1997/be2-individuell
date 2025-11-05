import type { Context, Next } from "hono"
import { setCookie } from "hono/cookie"
import { createServerClient, parseCookieHeader } from "@supabase/ssr"
import type { SupabaseClient, User } from "@supabase/supabase-js"
import { supabaseUrl, supabaseAnonKey } from "../lib/supabase.js"
import { HTTPException } from "hono/http-exception"

declare module "hono" {
  interface ContextVariableMap {
    supabase: SupabaseClient
    user: User | null
  }
}

function createSupabaseForRequest(c: Context) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(c.req.header("Cookie") ?? "").map(
          ({ name, value }) => ({ name, value: value ?? "" })
        )
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          setCookie(c, name, value, {
            ...options,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          })
        })
      },
    },
  })
}

export async function withSupabase(c: Context, next: Next) {
  if (!c.get("supabase")) {
    const sb = createSupabaseForRequest(c)
    c.set("supabase", sb)

    const { 
      data: {user}
      , error } = await sb.auth.getUser()
    c.set("user", error ? null : user)
  }
  return next()
}

export async function optionalAuth(c: Context, next: Next) {
  return withSupabase(c, next)
}

export async function requireAuth(c: Context, next: Next) {
  await withSupabase(c, async () => {})
  const user = c.get("user")
  console.log("Authenticated user:", user)
  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" })
  }
  return next()
}

//OM NEDAN SKA ANVÄNDAS MÅSTE DEN GÖRAS OM I ENLIGHET MED DEN NYARE requireOwnerOrAdmin FUNKTIONEN!!
// export async function requirePropertyOwner(c: Context, next: Next) {
//   await withSupabase(c, async () => {});

//   const sb = c.get("supabase");
//   const user = c.get("user");

//   if (!user) {
//     throw new HTTPException(401, { message: "Unauthorized" });
//   }

//   const { data: profile, error: profileError } = await sb
//     .from("profileusers")
//     .select("ispropertyowner, isadmin")
//     .eq("profileuser_id", user.id)
//     .single();

//   if (profileError || !profile) {
//     throw new HTTPException(404, { message: "User profile not found" });
//   }

//   if (profile.ispropertyowner === false && profile.isadmin === false) {
//     throw new HTTPException(403, { message: "Forbidden: You must be property owner" });
//   }

//   return next();
// }

export async function requireOwnerOrAdmin(c: Context, next: Next) {
  await withSupabase(c, async () => {});
  const sb = c.get("supabase");
  const user = c.get("user");

  if (!user) throw new HTTPException(401, { message: "Unauthorized" });

  const { data: profile, error: profileError } = await sb
    .from("profileusers")
    .select("profileuser_id, isadmin")
    .eq("profileuser_id", user.id)
    .single();

  if (profileError || !profile) throw new HTTPException(404, { message: "User profile not found" });

  const resourceId = c.req.param("id");
  if (!resourceId) throw new HTTPException(400, { message: "Resource ID missing" });

  const isBooking = c.req.path.includes("/bookings/");
  const isProperty = c.req.path.includes("/properties/");

  if (isBooking) {
    const { data: booking, error: bookingError } = await sb
      .from("bookings")
      .select("booking_id, property_id, profileuser_id")
      .eq("booking_id", resourceId)
      .single();

    if (bookingError || !booking) throw new HTTPException(404, { message: "Booking not found" });

    const { data: property, error: propertyError } = await sb
      .from("properties")
      .select("owner_id")
      .eq("property_id", booking.property_id)
      .single();

    if (propertyError || !property) throw new HTTPException(404, { message: "Property not found" });

    const isPropertyOwner = property.owner_id === user.id;
    const isBookingOwner = booking.profileuser_id === user.id;

    if (!isPropertyOwner && !profile.isadmin && !isBookingOwner) {
      throw new HTTPException(403, { message: "Forbidden: Must be property owner, admin, or booking owner" });
    }

    return next();
  }

  if (isProperty) {
    const { data: property, error: propertyError } = await sb
      .from("properties")
      .select("owner_id")
      .eq("property_id", resourceId)
      .single();

    if (propertyError || !property) throw new HTTPException(404, { message: "Property not found" });

    if (property.owner_id !== user.id && !profile.isadmin) {
      throw new HTTPException(403, { message: "Forbidden: Must be property owner or admin" });
    }

    return next();
  }

  throw new HTTPException(400, { message: "Unknown resource type" });
}

export async function requireAdmin(c: Context, next: Next) {
  await withSupabase(c, async () => {});
  const user = c.get("user");
  if (!user) throw new HTTPException(401, { message: "Unauthorized" });

  const sb = c.get("supabase");
  const { data: profile, error } = await sb
    .from("profileusers")
    .select("isadmin")
    .eq("profileuser_id", user.id)
    .single();

  if (error || !profile?.isadmin) {
    throw new HTTPException(403, { message: "Forbidden: Admins only" });
  }

  return next();
}