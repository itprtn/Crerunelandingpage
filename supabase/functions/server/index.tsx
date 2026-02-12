import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Supabase admin client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

// Logger
app.use("*", logger(console.log));

// CORS
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

// ================= HEALTH =================
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// ================= LEADS =================

// Create lead (public)
app.post("/leads", async (c) => {
  try {
    const body = await c.req.json();
    const { first_name, last_name, email, phone, profession, message } = body;

    if (!first_name || !last_name || !email || !phone || !profession) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const leadId = `lead_${Date.now()}`;
    const leadData = {
      id: leadId,
      first_name,
      last_name,
      email,
      phone,
      profession,
      message: message || "",
      status: "new",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await kv.set(leadId, leadData);

    return c.json({ success: true, leadId });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to create lead" }, 500);
  }
});

// Get leads (auth required)
app.get("/leads", async (c) => {
  try {
    const token = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const leads = await kv.getByPrefix("lead_");
    return c.json({ leads });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to fetch leads" }, 500);
  }
});

// ================= SETTINGS =================

app.get("/settings", async (c) => {
  const settings = await kv.get("app_settings");
  return c.json(settings || {});
});

app.put("/settings", async (c) => {
  const token = c.req.header("Authorization")?.split(" ")[1];
  const { data: { user } } = await supabase.auth.getUser(token);

  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const body = await c.req.json();
  await kv.set("app_settings", body);

  return c.json({ success: true });
});

Deno.serve(app.fetch);
