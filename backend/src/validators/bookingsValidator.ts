import * as z from 'zod'
import { zValidator } from '@hono/zod-validator'

const bookingSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  profileuser_id: z.string().uuid("Invalid user ID"),
  start_date: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: "Invalid start date"
  }),
  end_date: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: "Invalid end date"
  }),
});

const bookingValidator = zValidator("json", bookingSchema, (result, c) => {
  if (!result.success) {
    return c.json({ errors: result.error.issues }, 400);
  }
});

export default bookingValidator;