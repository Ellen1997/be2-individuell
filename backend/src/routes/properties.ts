import { Hono } from "hono";
import { propertyValidator } from "../validators/propertyValidator.js";
import type { Property, NewProperty, PropertyListQuery } from "../../../types/property.js"
import { requireAuth } from "../middleware/auth.js";
import type { PaginatedListResponse } from "../../../types/general.js"
import { supabaseAdmin } from "../lib/supabaseAdmin.js";
import { requireOwnerOrAdmin } from "../middleware/auth.js";

import * as db from "../database/property.js"

const propertiesApp = new Hono();

propertiesApp.get("/", async (c) => {
  const sb = c.get("supabase");

  try {
  
    const url = new URL(c.req.url);
    const query: PropertyListQuery = {};

    const limitParam = url.searchParams.get("limit");
    if (limitParam) query.limit = Number(limitParam);

    const offsetParam = url.searchParams.get("offset");
    if (offsetParam) query.offset = Number(offsetParam);

    const sortParam = url.searchParams.get("sort");
    if (sortParam) query.sort = sortParam;

    const locationParam = url.searchParams.get("location");
    if (locationParam) query.location = locationParam;

    const minPriceParam = url.searchParams.get("minPrice");
    if (minPriceParam) query.minPrice = Number(minPriceParam);

    const maxPriceParam = url.searchParams.get("maxPrice");
    if (maxPriceParam) query.maxPrice = Number(maxPriceParam);

  
    const properties: PaginatedListResponse<Property> = await db.getProperties(query, sb);

    return c.json(properties, 200);
  } catch (err) {
    return c.json({ error: (err as Error).message }, 500);
  }
});

propertiesApp.get("/:id", async (C)=> {
    const sb = C.get("supabase");


    const { id } = C.req.param();
    const property = await db.getProperty(sb, id)
    
    return C.json(property, 200);
})

propertiesApp.get("/owner/:id", async (c) => {
  try {
    const sb = c.get("supabase");
    const  id = c.req.param("id");

    const { data, error } = await sb
      .from("properties")
      .select("*")
      .eq("owner_id", id);

    if (error) throw new Error(error.message);

    return c.json(data, 200);
  } catch (err) {
    return c.json({ error: (err as Error).message }, 400);
  }
});


propertiesApp.post("/", requireAuth, propertyValidator, async (c) => {
    try{
        const sb = c.get("supabase");
        const user = c.get("user");

        if (!user) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        const payload = c.req.valid("json");

        console.log(" Mottaget payload från frontend:", payload);

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

propertiesApp.put("/:id", requireAuth, propertyValidator, async (c) => {
  try {
    const sb = c.get("supabase");
    const user = c.get("user");
    const id = c.req.param("id");
    const payload = c.req.valid("json");

        if (!user) {
          return c.json({ error: "Unauthorized" }, 401);
        }

    const existing = await db.getProperty(sb, id);
    if (!existing || existing.owner_id !== user.id) {
      return c.json({ error: "Du har inte behörighet att uppdatera denna property." }, 403);
    }

    const updatedProperty = await db.updateProperty(sb, id, payload);
    return c.json(updatedProperty, 200);
  } catch (err) {
    console.error(err);
    return c.json({ error: (err as Error).message }, 400);
  }
});

propertiesApp.patch("/:id", requireAuth, requireOwnerOrAdmin, async (c) => {
  try {
    const sb = c.get("supabase");
    const user = c.get("user");
    const  id = c.req.param("id");
    const fields = await c.req.json();

        if (!user) {
          return c.json({ error: "Unauthorized" }, 401);
        }

    const existing = await db.getProperty(sb, id);
    if (!existing) {
      return c.json({ error: "Property hittades ej" }, 404);
    }

     const { data: profile } = await sb
      .from("profileusers")
      .select("isadmin")
      .eq("profileuser_id", user.id)
      .single();
      
    const patchedProperty = await db.patchProperty(sb, id, fields);
    return c.json(patchedProperty, 200);
  } catch (err) {
    console.error(err);
    return c.json({ error: (err as Error).message }, 400);
  }
});

propertiesApp.delete("/:id", requireAuth, requireOwnerOrAdmin,  async (c) => {
  try {
    const sb = c.get("supabase");
    const user = c.get("user");
    const id = c.req.param("id");

        if (!user) {
          return c.json({ error: "Unauthorized" }, 401);
        }

    const existing = await db.getProperty(sb, id);
    if (!existing) {
      return c.json({ error: "ingen property hittades" }, 404);
    }

    const { data: profile } = await sb
      .from("profileusers")
      .select("isadmin")
      .eq("profileuser_id", user.id)
      .single();

    await db.deleteProperty(sb, id);
    return c.json({ success: true, message: "Property borttagen." }, 200);
  } catch (err) {
    console.error(err);
    return c.json({ error: (err as Error).message }, 400);
  }
});




export default propertiesApp;