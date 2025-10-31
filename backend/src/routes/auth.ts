import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import * as db from "../database/users.js";
import { registerValidator } from "../validators/registerValidator.js";
import { setCookie } from "hono/cookie";

export const authApp = new Hono()


authApp.get("/authusers", async (c) => {
    const sb = c.get("supabase");

    const response = await db.getUsers({}, sb);
    return c.json(response, 200);
}
);

authApp.get("/activeUser", async (c) => {
  const sb = c.get("supabase");
  const { data, error } = await sb.auth.getUser();

  if (error || !data?.user) {
    return c.json({ user: null }, 200); 
  }

  const profileResponse = await sb
    .from("profileusers")
    .select("name, email, phone_number, isadmin, ispropertyowner")
    .eq("profileuser_id", data.user.id)
    .single();

  return c.json({
    user: {
      id: data.user.id,
      email: data.user.email,
      name: profileResponse.data?.name ?? null,
      phone_number: profileResponse.data?.phone_number ?? null,
      isadmin: profileResponse.data?.isadmin ?? false,
      ispropertyowner: profileResponse.data?.ispropertyowner ?? false,
    },
  }, 200);
});


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
    maxAge: 60 * 60 * 24 * 7,        
    sameSite: "Lax",
    path: "/", });

  setCookie(c, "refresh_token", data.session?.refresh_token ?? "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, 
    sameSite: "Lax",
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

authApp.post("/logout", async (c) => {
  const supabase = c.get("supabase");
  await supabase.auth.signOut();
  
  setCookie(c, "access_token", "", { maxAge: 0, path: "/" });
  setCookie(c, "refresh_token", "", { maxAge: 0, path: "/" });
  return c.json({ message: "Logged out" }, 200);
});

export default authApp;