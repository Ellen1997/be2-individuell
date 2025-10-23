import { Hono } from "hono";
import bookingValidator from "../validators/bookingsValidator.js"
import { requireAdmin } from "../middleware/auth.js";

import * as db from "../database/bookings.js";

const bookingsApp = new Hono();

bookingsApp.get("/", requireAdmin, async (c) => {
    const sb = c.get("supabase");
    try {
        const bookings: PaginatedListResponse<Booking> = await db.getBookings({}, sb)
        return c.json(bookings, 200)

    } catch (err) {
        return c.json({error: (err as Error).message}, 500)
    }
})

bookingsApp.post("/", bookingValidator, async (c) => {
  const sb = c.get("supabase");
  const payload: NewBooking = c.req.valid("json");

  try {
    const booking: Booking = await db.createBookings(sb, payload);
    return c.json(booking, 201);
  } catch (err) {
    return c.json({ error: (err as Error).message }, 400);
  }
});


bookingsApp.get("/property/:id", async (c) => {
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
  const sb = c.get("supabase");
  const userId: string = c.req.param("id");
  try {
    const bookings: Booking[] = await db.getBookingsByUser(sb, userId);
    return c.json({
        message: "Bokningar för användare:",
        bookings: bookings}, 200);
  } catch (err) {
    return c.json({ error: (err as Error).message }, 500);
  }
});

export default bookingsApp;

//Denna sköter sig, så gör om alla routes efter denna som nu är strikt typad och korrekt.
//Databas filerna fortf knas