import { Hono } from "hono";
import bookingValidator from "../validators/bookingsValidator.js"
import { requireAuth } from "../middleware/auth.js";
import type { PaginatedListResponse } from "../../../types/general.js"
import type { Booking, NewBooking } from "../../../types/bookings.js"

import * as db from "../database/bookings.js";

const bookingsApp = new Hono();

bookingsApp.get("/", async (c) => {
    const sb = c.get("supabase");
    try {
        const bookings: PaginatedListResponse<Booking> = await db.getBookings({}, sb)
        return c.json(bookings, 200)

    } catch (err) {
        return c.json({error: (err as Error).message}, 500)
    }
})

bookingsApp.get("/:id", async (c) => {
    const sb = c.get("supabase");

        const { id } = c.req.param();
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
