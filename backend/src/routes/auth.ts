import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import * as db from "../database/users.js";
import { registerValidator } from "../validators/registerValidator.js";

export const authApp = new Hono()


authApp.get("/authusers", async (c) => {
    const sb = c.get("supabase");

    const response = await db.getUsers({}, sb);
    return c.json(response, 200);
}
);


authApp.post("/login", async (c) => {
  const { email, password } = await c.req.json()
  const supabase = c.get("supabase")
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    throw new HTTPException(401, { res: c.json({ error: "Invalid credentials" }, 401) })
  }

    const profileResponse = await supabase
    .from("profileusers")
    .select("*")
    .eq("profileuser_id", data.user.id) 
    .single();

  if (profileResponse.error) {
    throw new HTTPException(404, {
      res: c.json({ error: "User profile not found" }, 404),
    });
  }

  return c.json({
    message: "Login successful",
    user: {
      id: data.user.id,
      email: data.user.email,
      name: profileResponse.data.name,
      phone_number: profileResponse.data.phone_number,
      isadmin: profileResponse.data.isadmin,
      ispropertyowner: profileResponse.data.ispropertyowner,
    },
    session: data.session,
  }, 200);
})

authApp.post("/register", registerValidator, async (c) => {
  const { email, password, name, phone_number, ispropertyowner, isadmin} = c.req.valid("json");
  const supabase = c.get("supabase")

  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    throw new HTTPException(400, { res: c.json({ error: error.message }, 400) })
  }

  const userId = data.user?.id;
  if(!userId) {
    throw new HTTPException(400, {res: c.json({error: "No user ID return from supabase"}, 400) })
  }

  const insertResponse = await supabase.from("profileusers").insert({
  profileuser_id: userId,
  name: name,
  email: email,
  phone_number: phone_number,
  ispropertyowner: ispropertyowner ?? false,
  isadmin: isadmin ?? false,
});

if (insertResponse.error) {
  throw new HTTPException(400, { res: c.json({ error: insertResponse.error.message }, 400) });
}

return c.json({ message: "User registered successfully", user: data.user }, 201);
});

export default authApp;