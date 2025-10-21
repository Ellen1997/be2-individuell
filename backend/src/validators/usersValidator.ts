import * as z from 'zod'
import { zValidator } from '@hono/zod-validator'


const schema = z.object ({
    name: z.string("Name is required"),
    email: z.string("Email is required"),
    phone_number: z.string("Phone number is required"),
    isadmin: z.boolean().optional(),
    isPropertyOwner: z.boolean().optional()
})

export const userValidator = zValidator("json", schema, (result, c) => {
    if(!result.success) {
        return c.json({ errors: result.error.issues}, 400);
    }

});