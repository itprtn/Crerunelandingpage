# 🔧 DEBUGGING & TESTING GUIDE

## 🚀 Situation

Your Netlify site is deployed but API calls return **502 errors**. Here's the complete debug & fix plan.

---

## ✅ STEP 1: Verify Database Setup

### Option A: Using Neon Dashboard
1. Go to https://console.neon.tech
2. Select your project
3. Open SQL Editor
4. Run the init script:

```bash
# Copy all SQL from: scripts/01-init-neon.sql
# Paste into Neon SQL editor and execute
```

### Option B: Using psql (if installed)
```bash
psql postgresql://neondb_owner:npg_...@ep-...-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require

# Then paste contents of scripts/01-init-neon.sql
```

### Verify tables exist:
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

Should show:
- ✅ users
- ✅ leads  
- ✅ user_roles
- ✅ app_settings
- ✅ audit_logs

---

## ✅ STEP 2: Check Environment Variables in Netlify

1. Go to **Netlify Dashboard** → Your Site → **Site Settings**
2. Click **Build & Deploy** → **Environment**
3. Verify these variables exist:

```
DATABASE_URL = postgresql://neondb_owner:npg_...@ep-...-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require

JWT_SECRET = your-secret-key (or change-this-in-production)

NODE_ENV = development
```

If missing, add them!

---

## ✅ STEP 3: Test Health Endpoint

Open your browser and visit:

```
https://your-site.netlify.app/.netlify/functions/api/health
```

### Expected Response (✅ working):
```json
{
  "status": "ok",
  "timestamp": "2026-02-17T10:30:00.000Z",
  "database": "connected"
}
```

### If you get 502 error (❌ broken):
- Check Netlify deploy logs
- Look for errors in the function build
- Verify DATABASE_URL is set

---

## ✅ STEP 4: Create Test Admin User

### Method 1: Using Neon SQL Editor
```sql
-- First, generate a bcryptjs hash for password "admin123"
-- You can use: https://bcryptjs-demo.herokuapp.com or Node.js locally

INSERT INTO users (email, password_hash, first_name, last_name, is_active) 
VALUES ('admin@test.com', '$2b$10$...[hash]...', 'Admin', 'Test', true);

INSERT INTO user_roles (user_id, role)
SELECT id, 'admin' FROM users WHERE email = 'admin@test.com';
```

### Method 2: Using Frontend Sign Up
1. Go to https://your-site.netlify.app
2. Click **Sign Up**
3. Create account: `admin@test.com` / `password123`

---

## ✅ STEP 5: Test Sign In API

### Using curl:
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123"
  }'
```

### Expected Response:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "admin@test.com",
    "first_name": "Admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## ✅ STEP 6: Test Leads API

### Create a lead (no auth required):
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jean",
    "last_name": "Dupont",
    "email": "jean@example.com",
    "phone": "+33123456789",
    "profession": "Software Engineer",
    "message": "Hello from test"
  }'
```

### Get leads (requires auth):
```bash
curl -X GET https://your-site.netlify.app/.netlify/functions/api/leads \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## ✅ STEP 7: Test Settings API

```bash
curl -X GET https://your-site.netlify.app/.netlify/functions/api/settings
```

Expected Response:
```json
{
  "success": true,
  "settings": {
    "site_name": "Premunia CRM",
    "site_url": "https://premunia.netlify.app",
    "support_email": "support@premunia.com"
  }
}
```

---

## 🆘 TROUBLESHOOTING

### Problem: Still getting 502

**Solution**: Check Netlify function logs
1. Go to Netlify → **Site Settings**
2. Click **Deploys** → Latest Deploy
3. Click **Deploy Log** → **Functions**
4. Look for error messages

Common errors:
- `Cannot find module 'pg'` → Missing dependency
- `DATABASE_URL not configured` → Missing env var
- `ECONNREFUSED` → Database connection issue

---

### Problem: `Cannot find module...`

**Fix**: Rebuild with clean cache
1. Netlify Dashboard → **Build & Deploy** → **Trigger Deploy**
2. Click **Building without cache**

---

### Problem: Database tables don't exist

**Fix**: Run init script in Neon Dashboard
1. Go to https://console.neon.tech
2. Click **SQL Editor**
3. Copy-paste all SQL from `scripts/01-init-neon.sql`
4. Run it

---

## 📊 ADMIN INTERFACE TEST

Once API is working:

1. Go to https://your-site.netlify.app/admin
2. Sign In with `admin@test.com` / `password123`
3. You should see:
   - ✅ Dashboard with leads list
   - ✅ Leads Management
   - ✅ Settings
   - ✅ Automation

---

## 🎯 EXPECTED DATA FLOW

```
Frontend (React) 
    ↓
https://site.netlify.app/.netlify/functions/api/{endpoint}
    ↓
Netlify Function (netlify/functions/api.ts)
    ↓
Neon PostgreSQL Database
    ↓
Response back to frontend
```

---

## ✨ FINAL CHECKLIST

- [ ] Database tables exist in Neon
- [ ] Environment variables set in Netlify
- [ ] Health endpoint returns 200 + "connected"
- [ ] Can sign up new user from frontend
- [ ] Can sign in
- [ ] Can create leads
- [ ] Can view admin page
- [ ] Admin interface shows leads

---

## 🚀 IF EVERYTHING WORKS

You now have a **fully functional CRM**:
- ✅ Landing page with lead capture form
- ✅ User authentication (signup/signin)
- ✅ Admin dashboard
- ✅ Leads management
- ✅ Settings management
- ✅ Full API with CRUD operations
- ✅ Production deployment on Netlify + Neon

**Congratulations!** 🎉

---

## 📞 Need Help?

1. Check deploy logs in Netlify
2. Test health endpoint: `/.netlify/functions/api/health`
3. Verify DATABASE_URL in Netlify settings
4. Verify tables exist in Neon
5. Check auth token format in requests
