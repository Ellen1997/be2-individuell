import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import * as db from "../database/users.js";
import { registerValidator } from "../validators/registerValidator.js";
import { setCookie } from "hono/cookie";
import { set } from "zod";

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

  setCookie(c, "access_token", data.session?.access_token ?? "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 60 * 60 * 24 * 7, 
    path: "/", });

  setCookie(c, "refresh_token", data.session?.refresh_token ?? "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

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


authApp.post("/logout", (c) => {
  setCookie(c, "access_token", "", { maxAge: 0, path: "/" });
  setCookie(c, "refresh_token", "", { maxAge: 0, path: "/" });
  return c.json({ message: "Logged out" });
});

export default authApp;