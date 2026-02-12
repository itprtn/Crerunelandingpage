# ✅ AFTER EXECUTING THE SQL

## You've executed `scripts/01-init-supabase-FINAL.sql` 

Now verify everything worked!

---

## Quick Verification (5 minutes)

### 1. Check Supabase Dashboard

Go to: https://supabase.com/dashboard → gfedfklnzkgifpdxrybh

#### Table Editor
Click **Table Editor** and verify these 7 tables exist:

```
✓ leads
✓ app_settings
✓ user_roles  
✓ smtp_config
✓ audit_logs
✓ email_history
✓ lead_activities
```

#### app_settings Table
Click `app_settings` and verify 5 default rows:
```
1. hero_title = "Préparez votre retraite..."
2. hero_subtitle = "Le Plan Épargne Retraite..."
3. contact_email = "contact@premunia.fr"
4. contact_phone = "01 00 00 00 00"
5. contact_address = "828 Av. Roger Salengro..."
```

#### Authentication
Click **Authentication** tab and verify Auth is enabled.

---

### 2. Test Connection Locally

```bash
npm run dev
```

Check **browser console** (F12 → Console):

Should show:
```
✓ [Supabase] Connection successful
```

If you see errors:
- Check `.env.local` exists
- Check credentials are correct
- Restart: `npm run dev`

---

### 3. Test the Landing Page Form

1. Go to: http://localhost:5173/
2. Fill the contact form with test data
3. Submit the form
4. You should see: "Thank you!"

Then verify the lead was created:
1. Go to Supabase dashboard
2. Table Editor → **leads**
3. You should see 1 row with your test lead

---

## Detailed Verification (if you want to be thorough)

### Check Indexes
```
In Supabase SQL Editor, run:

SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

Should show ~13 indexes across all tables.

### Check RLS Policies
```
Go to: SQL Editor → (no query needed)
Look for green checkmarks on all tables in left sidebar.
Then click any table and check "Security" tab.

Should show 14 policies total.
```

### Check Triggers
```
In SQL Editor, run:

SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table;
```

Should show ~5 triggers.

---

## Common Issues & Fixes

### Issue: SQL Execution Failed
**Error**: "Syntax error near..."

**Fix**: 
- Make sure you copied the ENTIRE file
- Paste into SQL Editor and try again
- Check SQL file hasn't been modified

### Issue: Tables Don't Appear
**Error**: Table Editor shows no tables

**Fix**:
- Refresh the page (F5)
- Wait 10 seconds
- Try again

### Issue: Connection Test Shows Errors
**Error**: "[v0] Supabase client failed..."

**Fix**:
- Delete `.env.local`
- Copy from `.env.example`
- Update with your credentials
- Restart npm

### Issue: Form Submission Fails
**Error**: "Failed to create lead"

**Fix**:
- Check RLS policies are enabled
- Try from Supabase SQL Editor: `SELECT COUNT(*) FROM leads;`
- Should return a number (even if 0)

---

## What To Do Next

### If Everything Works ✅

Great! Your database is ready:

1. Continue developing your app
2. Use the tables to store data
3. When ready, follow `DEPLOYMENT_NETLIFY.md` to deploy

### If Something Fails ❌

Try these steps:

1. Refresh Supabase dashboard (F5)
2. Wait 30 seconds
3. Try again
4. Check SQL Editor for error messages
5. Compare with `EXECUTE_THIS_SQL.md` instructions

---

## File References

- **Schema Details**: `DATABASE_SCHEMA.md`
- **Deployment**: `DEPLOYMENT_NETLIFY.md`
- **Cleanup**: `CLEANUP_OLD_FILES.md`
- **Full Status**: `FINAL_STATUS.txt`

---

## You're Done with Database Setup! 🎉

Next steps:

1. ✅ Execute SQL
2. ✅ Verify tables exist
3. ✅ Test connection
4. → Ready to deploy!

See `DEPLOYMENT_NETLIFY.md` when you're ready to go live.
