# FIX ERRORS - Execute This SQL NOW

## The Problem
- Console errors: 401, 500 on `/settings` and `/leads`
- This is because **the database tables don't exist yet**

## The Solution (5 minutes)

### Step 1: Open Supabase Dashboard
Go to: https://supabase.com/dashboard/projects

### Step 2: Select Your Project
Click: **gfedfklnzkgifpdxrybh**

### Step 3: Open SQL Editor
In the left sidebar:
- Click **SQL Editor**
- Click **New Query** (blue button)

### Step 4: Copy & Paste SQL
Open: `/scripts/01-init-supabase-FINAL.sql`

Copy ALL the content and paste it into the SQL Editor.

### Step 5: Execute
Click the blue **Run** button.

**You should see:**
```
✓ 7 tables created
✓ 14 RLS policies created
✓ 13 indexes created
✓ 5 triggers created
```

### Step 6: Verify in Table Editor
Go to **Table Editor** (left sidebar)

You should see:
- ✓ leads
- ✓ app_settings
- ✓ user_roles
- ✓ smtp_config
- ✓ audit_logs
- ✓ email_history
- ✓ lead_activities

### Step 7: Refresh Browser
Back to your app: `http://localhost:5173`

Press `F5` or `Ctrl+R` to refresh.

**The errors should be GONE!**

---

## If Still Getting Errors

1. Check browser console (F12)
2. Try submitting the form - it should work now
3. Go to Supabase **Table Editor** → **leads** → you should see your submission!

---

## That's It!
The app will now:
- ✓ Fetch settings from `app_settings` table
- ✓ Save leads to `leads` table
- ✓ Show success toast message
- ✓ No more 401/500 errors

