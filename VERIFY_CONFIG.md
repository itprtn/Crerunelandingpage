# Verification Checklist - Supabase Configuration

**Date**: 2026-02-12
**Project**: Premunia CRM Landing Page
**Supabase Project**: `gfedfklnzkgifpdxrybh`

---

## ✅ Configuration Files Created

### Environment Files
- [x] `.env.local` - Contains Supabase credentials
- [x] `.env.example` - Template for environment variables
- [x] `netlify.toml` - Netlify deployment configuration

### Source Code
- [x] `src/lib/supabase-client.ts` - Supabase client initialization
- [x] `scripts/test-supabase-connection.ts` - Connection testing script
- [x] `scripts/run-migration.sh` - Database migration runner script
- [x] `scripts/01-init-supabase.sql` - Complete database schema

### Documentation
- [x] `SUPABASE_CONNECTION.md` - Connection setup guide
- [x] `DATABASE_SCHEMA.md` - Database schema documentation
- [x] `DEPLOYMENT_NETLIFY.md` - Netlify deployment guide
- [x] `README_SETUP.md` - Project setup guide

---

## 🔐 Credentials Verification

### Provided Credentials
```
Supabase Project ID:  gfedfklnzkgifpdxrybh
Supabase URL:         https://gfedfklnzkgifpdxrybh.supabase.co
Anon Key Starts:      eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIs...
Service Key Starts:   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIs...
```

### Credentials in `.env.local`
```
✓ VITE_SUPABASE_URL is set
✓ VITE_SUPABASE_ANON_KEY is set
✓ VITE_SUPABASE_SERVICE_ROLE_KEY is set
✓ VITE_API_URL is set
```

---

## 📋 Pre-Migration Checklist

Before running the migration, verify:

- [ ] You have access to Supabase dashboard: https://supabase.com/dashboard
- [ ] You can see your project: `gfedfklnzkgifpdxrybh`
- [ ] You have SQL Editor access
- [ ] You have created the project (if not, follow Supabase onboarding)
- [ ] Internet connection is stable

---

## 🗄️ Database Migration Steps

### Step 1: Access Supabase SQL Editor
1. Go to: https://supabase.com/dashboard
2. Select project: `gfedfklnzkgifpdxrybh`
3. Click: **SQL Editor** (left sidebar)
4. Click: **New Query**

### Step 2: Copy SQL Migration
```bash
# In your terminal:
cat scripts/01-init-supabase.sql
```
Or view at: `scripts/01-init-supabase.sql`

### Step 3: Paste and Execute
1. Copy all SQL code from the migration file
2. Paste into Supabase SQL Editor
3. Click **Run**
4. Wait for "Query successful" message

### Step 4: Verify Tables Created
1. Go to **Table Editor** in Supabase
2. You should see these 7 tables:
   - leads
   - app_settings
   - user_roles
   - smtp_config
   - audit_logs
   - email_history
   - lead_activities

---

## 🧪 Post-Migration Tests

### Test 1: Connection Test
```bash
# Run connection verification
npx ts-node scripts/test-supabase-connection.ts
```

**Expected Output:**
```
✓ VITE_SUPABASE_URL is set
✓ VITE_SUPABASE_ANON_KEY is set
✓ Supabase client created
✓ Database query successful
✓ Table "users" exists and is accessible
✓ Table "companies" exists and is accessible
... (all tables should show as existing)
✓ All tests passed!
```

### Test 2: Dev Server Test
```bash
# Start development server
npm run dev
```

**Check browser console (F12):**
```
[Supabase] Initializing with URL: https://gfedfklnzkgifpdxrybh.supabase.co
[Supabase] Connection successful ✓
```

### Test 3: Supabase Dashboard Verification
1. Open Supabase dashboard
2. Check **Authentication** → Should have auth system ready
3. Check **Database** → Should have all 7 tables
4. Check **Database** → **Policies** → Should have 14 RLS policies
5. Check **Database** → **Triggers** → Should have 4 triggers

---

## 📊 What Gets Created in Database

### Tables (7)
| Table | Purpose | Rows | Status |
|-------|---------|------|--------|
| leads | Lead tracking from landing page | 0 | Ready |
| app_settings | Application settings | 1 | Pre-populated |
| user_roles | User role management | 0 | Ready |
| smtp_config | Email configuration | 0 | Ready |
| audit_logs | Action audit trail | 0 | Ready |
| email_history | Email sending history | 0 | Ready |
| lead_activities | Lead activity log | 0 | Ready |

### Security Policies (14 RLS)
- leads: public_create, auth_read, auth_update, auth_delete
- app_settings: public_read, auth_insert, auth_update
- user_roles: users_read_own, auth_create, auth_update
- smtp_config: auth_read, auth_create, auth_update
- audit_logs: auth_read, system_insert
- email_history: auth_read, system_insert
- lead_activities: auth_read, system_insert

### Triggers & Functions (3)
- update_updated_at_column (for leads, app_settings, user_roles, smtp_config)
- get_lead_statistics (query function)
- log_audit_event (audit function)

### Indexes (13)
- idx_leads_status
- idx_leads_email
- idx_leads_created_at
- idx_leads_created_by
- idx_user_roles_user_id
- idx_audit_logs_user_id
- idx_audit_logs_created_at
- idx_audit_logs_resource
- idx_email_history_lead_id
- idx_email_history_status
- idx_email_history_created_at
- idx_lead_activities_lead_id
- idx_lead_activities_created_at

---

## 🚀 Environment Variables for Netlify

After database is ready, add these to Netlify **Build & Deploy** → **Environment**:

```
VITE_SUPABASE_URL=https://gfedfklnzkgifpdxrybh.supabase.co
VITE_SUPABASE_ANON_KEY=[Your Anon Key]
VITE_API_URL=https://gfedfklnzkgifpdxrybh.supabase.co/functions/v1
```

⚠️ **Do NOT add the Service Role Key to Netlify** - It's secret!

---

## ✅ Final Verification

Run this checklist before considering setup complete:

### Database
- [ ] All 7 tables exist (leads, app_settings, user_roles, smtp_config, audit_logs, email_history, lead_activities)
- [ ] Tables have correct columns
- [ ] 14 RLS policies enabled
- [ ] 4 Triggers working
- [ ] 13 Indexes created

### Code
- [ ] `.env.local` has correct credentials
- [ ] `src/lib/supabase-client.ts` exists
- [ ] Connection test passes
- [ ] Dev server starts without errors

### Deployment
- [ ] Netlify `netlify.toml` created
- [ ] Environment variables ready
- [ ] GitHub repository updated
- [ ] Ready for deployment

---

## 🔗 Quick Links

| Resource | Link |
|----------|------|
| Supabase Dashboard | https://supabase.com/dashboard |
| Project Reference | gfedfklnzkgifpdxrybh |
| SQL Editor | https://supabase.com/dashboard/project/gfedfklnzkgifpdxrybh/sql/new |
| Database Tables | https://supabase.com/dashboard/project/gfedfklnzkgifpdxrybh/editor |

---

## 🆘 Common Issues

### Issue: "Table does not exist"
**Solution**: Re-run the migration SQL script in Supabase SQL Editor

### Issue: "Permission denied"
**Solution**: Check RLS policies - user might not have correct permissions

### Issue: "Connection refused"
**Solution**: Check `.env.local` credentials are correct

### Issue: "CORS error"
**Solution**: Supabase should handle CORS automatically - check browser console for details

---

## 📞 Support

If you encounter issues:

1. Check error messages in browser console (F12)
2. Review Supabase documentation: https://supabase.com/docs
3. Check Supabase project logs for SQL errors
4. Verify credentials in `.env.local` match your project
5. Restart dev server: `npm run dev`

---

**Status**: ✅ Ready for Configuration
**Last Updated**: 2026-02-12
**Next Step**: Run database migration (see Step 1-4 above)
