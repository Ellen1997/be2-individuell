import { Hono } from "hono";
import bookingValidator from "../validators/bookingsValidator.js"
import { requireAuth, requireOwnerOrAdmin, requireAdmin } from "../middleware/auth.js";
import type { PaginatedListResponse } from "../../../types/general.js"
import type { Booking, BookingListQuery, NewBooking } from "../../../types/bookings.js"

import * as db from "../database/bookings.js";

const bookingsApp = new Hono();

bookingsApp.get("/", requireAdmin, async (c) => {
    const sb = c.get("supabase");
    try {
          const url = new URL(c.req.url);
          const query: BookingListQuery = {};
      
          const limitParam = url.searchParams.get("limit");
          if (limitParam) query.limit = Number(limitParam);
      
          const offsetParam = url.searchParams.get("offset");
          if (offsetParam) query.offset = Number(offsetParam);

        const bookings: PaginatedListResponse<Booking> = await db.getBookings(query, sb)
        return c.json(bookings, 200)

    } catch (err) {
        return c.json({error: (err as Error).message}, 500)
    }
})

bookingsApp.get("/:id", requireOwnerOrAdmin, async (c) => {
    const sb = c.get("supabase");

        const id  = c.req.param("id");
        const booking = await db.getBooking(sb, id)

        return c.json(booking, 200);

})

bookingsApp.post("/", requireAuth, bookingValidator, async (c) => {
  const sb = c.get("supabase");
  const user = c.get("user");

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const payload: Omit<NewBooking, "profileuser_id"> = c.req.valid("json");

  try {
    const booking: Booking = await db.createBookings(sb, {...payload, profileuser_id: user.id });
    return c.json(booking, 201);
  } catch (err) {
    return c.json({ error: (err as Error).message }, 400);
  }
});


bookingsApp.get("/property/:id", requireOwnerOrAdmin, async (c) => {
  const sb = c.get("supabase");
  const propertyId: string = c.req.param("id");
  try {
    const bookings: Booking[] = await db.getBookingsByProperty(sb, propertyId);
    return c.json({
        message: "Bokningar av property:",
        bookings: bookings}, 200);
  } catch (err) {
    return c.json({ error: (err as Error).message }, 500);
  }
});

bookingsApp.get("/user/:id", async (c) => {

  try {
    const sb = c.get("supabase");
    const  id = c.req.param("id");

    const { data, error } = await sb
      .from("bookings")
      .select(`
    *,
    profileusers (name),
    properties (property_name)
  `)
      .eq("profileuser_id", id);

    if (error) throw new Error(error.message);

    return c.json(data, 200);
  } catch (err) {
    return c.json({ error: (err as Error).message }, 400);
  }
});


bookingsApp.get("/ownerofproperty/:id", async (c) => {
  const sb = c.get("supabase");
  const ownerId: string = c.req.param("id");
  try {
    const bookings: Booking[] = await db.getBookingsByOwner(sb, ownerId);
    return c.json({
        message: "Bokningar av properties som ägs av dig:",
        data: bookings,
        count: bookings.length,
      }, 200);

  } catch (err) {
    return c.json({ error: (err as Error).message }, 500);
  }
});

bookingsApp.patch("/:id", requireAuth, requireOwnerOrAdmin,  async (c) => {
  const sb = c.get("supabase");
  const id = c.req.param("id");
  const user = c.get("user");

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const updates = await c.req.json();

    const updatedBooking = await db.updateBooking(sb, id, updates, user.id);
    return c.json(updatedBooking, 200);
  } catch (err) {
    return c.json({ error: (err as Error).message }, 400);
  }
});


bookingsApp.delete("/:id", requireAuth, requireOwnerOrAdmin, async (c) => {
  const sb = c.get("supabase");
  const id = c.req.param("id");
  const user = c.get("user");

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    await db.deleteBooking(sb, id);
    return c.json({ message: `Booking ${id} deleted successfully` }, 200);
  } catch (err) {
    return c.json({ error: (err as Error).message }, 400);
  }
});


export default bookingsApp;
