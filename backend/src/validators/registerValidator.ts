import * as z from 'zod'
import { zValidator } from '@hono/zod-validator'

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string(),
    phone_number: z.string(),
    ispropertyowner: z.boolean().optional(),
    isadmin: z.boolean().optional()

});

export const registerValidator = zValidator("json", registerSchema, (result, c) => {
    if(!result.success) {
        return c.json({ errors: result.error.issues}, 400);
    }

});