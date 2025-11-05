import { Hono } from "hono";
import { userValidator } from "../validators/usersValidator.js";
import type { User, NewUser, UserListQuery } from "../../../types/users.js";
import { requireAuth} from "../middleware/auth.js";
import { requireAdmin } from "../middleware/auth.js";
import type { PaginatedListResponse } from "../../../types/general.js"

import * as db from "../database/users.js";

const usersApp = new Hono();

usersApp.get("/", requireAdmin, async (c) => {
    const sb = c.get("supabase");
    try {
        const users: PaginatedListResponse<User> = await db.getUsers({}, sb);
        return c.json(users, 200);
    } catch (err) {
        return c.json({ error: (err as Error).message }, 500);
    }
});

usersApp.get("/:id", requireAdmin, async (c)=> {
    const sb = c.get("supabase");
    const id  = c.req.param("id");
    const user = await db.getUser(sb, id)
    return c.json(user, 200);
})

//ANVÄNDS EJ!!!
usersApp.post("/", userValidator, async (c) => {

    try {
        const sb = c.get("supabase");

        const payload = c.req.valid("json");

        const newUser: NewUser = {
            
            name: String(payload.name),
            email: String(payload.email),
            phone_number: String(payload.phone_number),
            isadmin: payload.isadmin ?? false,
            ispropertyowner: payload.isPropertyOwner ?? false,

        }

        const user: User = await db.createUser(sb, newUser);
        return c.json(user, 201);
    } catch (err) {
        console.log(err)
        return c.json(err)
    }
})

export default usersApp;