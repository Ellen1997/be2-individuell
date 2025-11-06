import { Hono } from "hono";
import type { User } from "../../../types/users.js";
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

export default usersApp;