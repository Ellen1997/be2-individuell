import { Hono } from "hono";
import { userValidator } from "../validators/usersValidator.js";

import * as db from "../database/users.js";

const usersApp = new Hono();

usersApp.get("/", async (c) => {
    const sb = c.get("supabase");

    const response = await db.getUsers({}, sb);
    return c.json(response, 200)
})


usersApp.post("/", userValidator, async (c) => {
    try {
        const sb = c.get("supabase");

        const payload = c.req.valid("json");

        const newUser: NewUser = {
            
            name: String(payload.name),
            email: String(payload.email),
            phone_number: String(payload.phone_number),
            isadmin: Boolean(payload.isadmin)

        }

        const user: User = await db.createUser(sb, newUser);
        return c.json(user, 201);
    } catch (err) {
        console.log(err)
        return c.json(err)
    }
})

export default usersApp;