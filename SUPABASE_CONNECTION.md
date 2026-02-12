# Supabase Connection & Setup Guide

**Status**: ✅ Ready to Configure

This guide will walk you through connecting your project to Supabase and testing the connection.

---

## 📋 What Has Been Created

✅ **`.env.local`** - Environment file with your Supabase credentials
✅ **`src/lib/supabase-client.ts`** - Supabase client initialization
✅ **`scripts/test-supabase-connection.ts`** - Connection test script
✅ **`scripts/run-migration.sh`** - Database migration runner
✅ **`scripts/01-init-supabase.sql`** - Complete database schema (250+ lines)

---

## 🚀 Quick Start (3 Steps)

### Step 1: Create Database Tables (10 minutes)

You have 2 options:

#### **Option A: Manual (Recommended for first time)**

1. Open your Supabase project dashboard:
   ```
   https://supabase.com/dashboard
   ```

2. Select your project: `gfedfklnzkgifpdxrybh`

3. Go to **SQL Editor** (left sidebar) → Click **New Query**

4. Run the migration script:
   ```bash
   bash scripts/run-migration.sh
   ```
   This will display the SQL code to copy

5. Copy all the SQL code displayed and paste it into the Supabase SQL Editor

6. Click **Run** and wait for completion

**Expected Result**: All tables created without errors

#### **Option B: Automatic (if Supabase CLI installed)**

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Link your project
supabase link --project-ref gfedfklnzkgifpdxrybh

# Run migration
bash scripts/run-migration.sh auto
```

---

### Step 2: Verify Environment Variables

Your `.env.local` file already contains:

```env
VITE_SUPABASE_URL=https://gfedfklnzkgifpdxrybh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ These are already set! No action needed.

**Security Note:**
- `VITE_SUPABASE_ANON_KEY` is PUBLIC (safe in frontend)
- `VITE_SUPABASE_SERVICE_ROLE_KEY` is SECRET (backend only)

---

### Step 3: Test the Connection

```bash
# Option 1: Start the dev server and check console
npm run dev

# Option 2: Run the connection test script
npx ts-node scripts/test-supabase-connection.ts

# Option 3: Or if you have Node.js with tsx
npm install -D tsx
npx tsx scripts/test-supabase-connection.ts
```

**Expected Output:**
```
✓ VITE_SUPABASE_URL is set
✓ VITE_SUPABASE_ANON_KEY is set
✓ Supabase client created
✓ Database query successful
✓ All tests passed!
```

---

## 🔍 Checking Your Supabase Project

After running the migration, you should see in your Supabase dashboard:

### Tables Created (8 total)
- ✅ `users` - User accounts
- ✅ `companies` - Company information
- ✅ `contacts` - Contact management
- ✅ `leads` - Lead tracking
- ✅ `opportunities` - Sales opportunities
- ✅ `tasks` - Task management
- ✅ `activities` - Activity logging
- ✅ `settings` - Application settings

### Security Features Enabled
- ✅ Row Level Security (RLS) - 11 policies
- ✅ Automatic auditing - 4 triggers
- ✅ Data integrity - Foreign keys & constraints
- ✅ Performance - 8 indexes

### How to Verify

1. Go to **Tables** section in Supabase
2. You should see all 8 tables listed
3. Click each table to view structure
4. Go to **Authentication** → **Users** to verify auth setup
5. Go to **Database** → **Policies** to verify RLS policies

---

## 🧪 Testing Features

### Test Authentication

```typescript
import { supabase } from '@/lib/supabase-client'

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'SecurePassword123!'
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'test@example.com',
  password: 'SecurePassword123!'
})

// Sign out
const { error } = await supabase.auth.signOut()

// Get current user
const { data: { user } } = await supabase.auth.getUser()
```

### Test Database Operations

```typescript
import { supabase } from '@/lib/supabase-client'

// Create
const { data, error } = await supabase
  .from('contacts')
  .insert([{ name: 'John Doe', email: 'john@example.com' }])

// Read
const { data, error } = await supabase
  .from('contacts')
  .select('*')

// Update
const { data, error } = await supabase
  .from('contacts')
  .update({ name: 'Jane Doe' })
  .eq('id', 1)

// Delete
const { data, error } = await supabase
  .from('contacts')
  .delete()
  .eq('id', 1)
```

### Real-time Subscriptions

```typescript
import { supabase } from '@/lib/supabase-client'

// Listen for changes
const subscription = supabase
  .channel('contacts')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'contacts' },
    (payload) => {
      console.log('Change detected:', payload)
    }
  )
  .subscribe()

// Cleanup
subscription.unsubscribe()
```

---

## 🔐 Environment Variables Reference

### Frontend (Safe to expose)
```env
VITE_SUPABASE_URL=https://gfedfklnzkgifpdxrybh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=https://gfedfklnzkgifpdxrybh.supabase.co/functions/v1
```

### Backend Only (Secret!)
```env
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🐛 Troubleshooting

### Problem: "VITE_SUPABASE_URL is not defined"

**Solution:**
1. Check `.env.local` exists in project root
2. Make sure it has the correct variables
3. Restart dev server: `npm run dev`

### Problem: "Relation does not exist"

**Solution:**
1. Run the migration: `bash scripts/run-migration.sh`
2. Check Supabase SQL Editor for errors
3. Verify tables exist in Supabase dashboard

### Problem: "Permission denied" errors

**Solution:**
1. Check Row Level Security policies in Supabase dashboard
2. Verify your user is authenticated
3. Check that the user has correct permissions in RLS policy

### Problem: Real-time not working

**Solution:**
1. Enable realtime in Supabase dashboard:
   - Go to **Database** → **Replication**
   - Enable replication for your tables
2. Restart the connection

---

## ✅ Connection Checklist

- [ ] `.env.local` file created with credentials
- [ ] Database migration ran successfully
- [ ] All 8 tables created in Supabase
- [ ] RLS policies enabled
- [ ] Connection test passed
- [ ] Authentication working (sign up/in/out)
- [ ] Database queries working
- [ ] Real-time subscriptions working (optional)

---

## 📚 Next Steps

1. **For Development:**
   - Start dev server: `npm run dev`
   - Test features in browser
   - Check Supabase dashboard for data

2. **For Production:**
   - See `DEPLOYMENT_NETLIFY.md` for Netlify deployment
   - Set environment variables in Netlify dashboard
   - Enable custom domain

3. **For Database Operations:**
   - See `DATABASE_SCHEMA.md` for complete schema documentation
   - Check RLS policies in Supabase dashboard
   - Review triggers and functions

---

## 🆘 Need Help?

If something doesn't work:

1. Check error messages in browser console (F12)
2. Check Supabase SQL Editor for syntax errors
3. Verify all tables exist in Supabase dashboard
4. Check environment variables in `.env.local`
5. Review RLS policies in Supabase dashboard
6. Check Supabase project limits (storage, connections, etc.)

---

## 🔗 Useful Links

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Supabase Docs**: https://supabase.com/docs
- **Project Reference**: gfedfklnzkgifpdxrybh
- **Project URL**: https://gfedfklnzkgifpdxrybh.supabase.co

---

**Last Updated**: 2026-02-12
**Status**: Ready to Connect
