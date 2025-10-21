import * as z from 'zod'
import { zValidator } from '@hono/zod-validator'

const propertySchema = z.object ({
    property_name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    location: z.string().min(1, "Location is required"),
    pricePerNight: z.number(),
    image_url: z.string().url({ message: "Must be a valid URL" }).optional(),
    owner_id: z.string().uuid("Owner ID must be a valid UUID")
})

export const propertyValidator = zValidator("json", propertySchema, (result, c) => {
    if (!result.success) {
        return c.json({ errors: result.error.issues }, 400);
    }
});