import { Hono } from "hono";
import { propertyValidator } from "../validators/propertyValidator.js";
import type { Property, NewProperty, PropertyListQuery } from "../../../types/property.js"
import { requireAuth } from "../middleware/auth.js";
import type { PaginatedListResponse } from "../../../types/general.js"

import * as db from "../database/property.js"

const propertiesApp = new Hono();

propertiesApp.get("/", async (c) => {
    const sb = c.get("supabase");

    try{
        const properties: PaginatedListResponse<Property> = await db.getProperties({}, sb);
    return c.json(properties, 200)

    } catch (err) {
        return c.json({error: (err as Error).message}, 500)
    }
    
})

propertiesApp.get("/:id", async (C)=> {
    const sb = C.get("supabase");


    const { id } = C.req.param();
    const property = await db.getProperty(sb, id)
    
    return C.json(property, 200);
})

propertiesApp.post("/", requireAuth, propertyValidator, async (c) => {
    try{
        const sb = c.get("supabase");
        const user = c.get("user");

        if (!user) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        const payload = c.req.valid("json");

        const newProperty: NewProperty = {

         property_name: String(payload.property_name),
         description: String(payload.description),
         location: String(payload.location),
         pricePerNight: Number(payload.pricePerNight),
         image_url: String(payload.image_url),
         owner_id: user.id
        }

        const property: Property = await db.createProperty(sb, newProperty);
        return c.json(property, 201);
    } catch (err) {
        console.log(err)
        return c.json({ error: (err as Error).message }, 400);
    }
})

export default propertiesApp;