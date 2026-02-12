import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase admin client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-07afcff5/health", (c) => {
  return c.json({ status: "ok" });
});

// ============ LEADS ROUTES ============

// Create a new lead (public)
app.post("/make-server-07afcff5/leads", async (c) => {
  try {
    const body = await c.req.json();
    const { first_name, last_name, email, phone, profession, message } = body;

    if (!first_name || !last_name || !email || !phone || !profession) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Store lead in KV store
    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const leadData = {
      id: leadId,
      first_name,
      last_name,
      email,
      phone,
      profession,
      message: message || '',
      status: 'new',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await kv.set(leadId, leadData);
    
    // Send auto-response email (placeholder for future implementation)
    console.log(`Lead created: ${leadId} - ${email}`);
    
    return c.json({ success: true, leadId });
  } catch (error) {
    console.error("Error creating lead:", error);
    return c.json({ error: "Failed to create lead" }, 500);
  }
});

// Get all leads (requires auth)
app.get("/make-server-07afcff5/leads", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const leads = await kv.getByPrefix('lead_');
    return c.json({ leads });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return c.json({ error: "Failed to fetch leads" }, 500);
  }
});

// Update lead status/notes (requires auth)
app.put("/make-server-07afcff5/leads/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const leadId = c.req.param('id');
    const body = await c.req.json();
    
    const existingLead = await kv.get(leadId);
    if (!existingLead) {
      return c.json({ error: 'Lead not found' }, 404);
    }

    const updatedLead = {
      ...existingLead,
      ...body,
      updated_at: new Date().toISOString(),
    };

    await kv.set(leadId, updatedLead);
    return c.json({ success: true, lead: updatedLead });
  } catch (error) {
    console.error("Error updating lead:", error);
    return c.json({ error: "Failed to update lead" }, 500);
  }
});

// Delete lead (requires auth)
app.delete("/make-server-07afcff5/leads/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const leadId = c.req.param('id');
    await kv.del(leadId);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting lead:", error);
    return c.json({ error: "Failed to delete lead" }, 500);
  }
});

// ============ SETTINGS ROUTES ============

// Get settings (public - for landing page)
app.get("/make-server-07afcff5/settings", async (c) => {
  try {
    const settings = await kv.get('app_settings');
    return c.json(settings || {
      hero_title: "Préparez votre retraite sans sacrifier votre présent",
      hero_subtitle: "Le Plan Épargne Retraite (PER) sur-mesure pour les professions libérales : optimisez votre fiscalité dès aujourd'hui.",
      contact_email: "contact@premunia.fr",
      contact_phone: "01 00 00 00 00",
      contact_address: "828 Av. Roger Salengro, 92370 Chaville"
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return c.json({ error: "Failed to fetch settings" }, 500);
  }
});

// Update settings (requires auth)
app.put("/make-server-07afcff5/settings", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    await kv.set('app_settings', body);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    return c.json({ error: "Failed to update settings" }, 500);
  }
});

// ============ USER MANAGEMENT ROUTES ============

// Sign up route
app.post("/make-server-07afcff5/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error("Signup error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.error("Error during signup:", error);
    return c.json({ error: "Failed to create user" }, 500);
  }
});

// Get user role
app.get("/make-server-07afcff5/user/role", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userRole = await kv.get(`user_role_${user.id}`);
    return c.json({ role: userRole?.role || 'user' });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return c.json({ error: "Failed to fetch user role" }, 500);
  }
});

// Promote user to admin
app.post("/make-server-07afcff5/promote-admin", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    await kv.set(`user_role_${user.id}`, { role: 'admin', updated_at: new Date().toISOString() });
    
    return c.json({ success: true, role: 'admin' });
  } catch (error) {
    console.error("Error promoting user:", error);
    return c.json({ error: "Failed to promote user" }, 500);
  }
});

// ============ SMTP/EMAIL CONFIG ROUTES ============

// Get SMTP config (requires auth)
app.get("/make-server-07afcff5/smtp-config", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const config = await kv.get('smtp_config');
    // Don't return password for security
    if (config) {
      delete config.password;
    }
    return c.json(config || {});
  } catch (error) {
    console.error("Error fetching SMTP config:", error);
    return c.json({ error: "Failed to fetch SMTP config" }, 500);
  }
});

// Update SMTP config (requires auth)
app.put("/make-server-07afcff5/smtp-config", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    await kv.set('smtp_config', body);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error updating SMTP config:", error);
    return c.json({ error: "Failed to update SMTP config" }, 500);
  }
});

Deno.serve(app.fetch);