import * as z from 'zod'
import { zValidator } from '@hono/zod-validator'

export const generateId = `id_${Math.floor(1000 + Math.random() * 9000)}`;

const schema = z.object ({
    profileuser_id: z.string().optional(),
    name: z.string("Name is required"),
    email: z.string("Email is required"),
    phone_number: z.string("Phone number is required"),
    isadmin: z.boolean().optional(),
})

export const userValidator = zValidator("json", schema, (result, c) => {
    if(!result.success) {
        return c.json({ errors: result.error.issues}, 400);
    }
    if(!result.data.profileuser_id) {
        result.data.profileuser_id = generateId
    }

});