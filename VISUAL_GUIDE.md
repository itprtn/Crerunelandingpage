# 📊 Visual Setup Guide

**Follow the arrows ➜ and execute the commands shown**

---

## 🎯 YOUR JOURNEY

```
START HERE
    ↓
 [STEP 1] Create Database
    ↓
 [STEP 2] Test Connection
    ↓
 [STEP 3] Start Dev Server
    ↓
  ✅ SUCCESS
```

---

## 📝 STEP 1: Create Database Tables

### What: Execute SQL migration
### Time: 5 minutes

```bash
┌─────────────────────────────────────────────┐
│ IN YOUR TERMINAL:                           │
└─────────────────────────────────────────────┘

$ bash scripts/run-migration.sh

┌─────────────────────────────────────────────┐
│ COPY ALL SQL CODE DISPLAYED                │
└─────────────────────────────────────────────┘
```

### Then in Browser:

```
1. Go to https://supabase.com/dashboard
2. Select project: gfedfklnzkgifpdxrybh
3. Click SQL Editor ➜ New Query
4. Paste SQL code
5. Click Run

✅ Result: All 7 tables created
```

### Visual:
```
┌──────────────────────────────────────┐
│ Supabase Dashboard                   │
├──────────────────────────────────────┤
│ Projects                             │
│  ├─ gfedfklnzkgifpdxrybh  ✓         │
│     ├─ leads              ✓ NEW    │
│     ├─ app_settings       ✓ NEW    │
│     ├─ user_roles         ✓ NEW    │
│     ├─ smtp_config        ✓ NEW    │
│     ├─ audit_logs         ✓ NEW    │
│     ├─ email_history      ✓ NEW    │
│     └─ lead_activities    ✓ NEW    │
└──────────────────────────────────────┘
```

---

## ✅ STEP 2: Test Connection

### What: Verify database is accessible
### Time: 5 minutes

```bash
┌─────────────────────────────────────────────┐
│ IN YOUR TERMINAL:                           │
└─────────────────────────────────────────────┘

$ npx ts-node scripts/test-supabase-connection.ts

┌─────────────────────────────────────────────┐
│ EXPECTED OUTPUT:                            │
└─────────────────────────────────────────────┘

✓ VITE_SUPABASE_URL is set
✓ VITE_SUPABASE_ANON_KEY is set
✓ Supabase client created
✓ Database query successful
✓ All tests passed!

✅ Result: Connection verified
```

---

## 🧪 STEP 3: Start Dev Server

### What: Launch your app locally
### Time: 5 minutes

```bash
┌─────────────────────────────────────────────┐
│ IN YOUR TERMINAL:                           │
└─────────────────────────────────────────────┘

$ npm install
$ npm run dev

┌─────────────────────────────────────────────┐
│ EXPECTED OUTPUT:                            │
└─────────────────────────────────────────────┘

> vite dev
  VITE v5.0.0 ready in 300 ms
  
  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Then in Browser:

```
1. Open http://localhost:5173/
2. Press F12 to open Console
3. Look for this message:

┌──────────────────────────────────────┐
│ [Supabase] Initializing with URL... │
│ [Supabase] Connection successful ✓  │
└──────────────────────────────────────┘

✅ Result: App is running and connected!
```

---

## 🎉 COMPLETE FLOW DIAGRAM

```
┌──────────────────────────────────────────────────────────┐
│                    YOUR SETUP FLOW                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1. bash scripts/run-migration.sh                        │
│     └─→ Copy SQL code                                   │
│         └─→ Paste in Supabase                           │
│             └─→ Click Run                               │
│                 └─→ ✓ Tables Created                    │
│                                                          │
│  2. npx ts-node scripts/test-supabase-connection.ts      │
│     └─→ ✓ All tests passed!                             │
│                                                          │
│  3. npm install && npm run dev                           │
│     └─→ Open http://localhost:5173/                     │
│         └─→ Check Console (F12)                         │
│             └─→ ✓ Connection successful ✓              │
│                                                          │
│  🎉 YOU'RE DONE!                                         │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 📊 ENVIRONMENT VARIABLES (Already Set ✓)

```
Your .env.local file:

VITE_SUPABASE_URL
  └─→ https://gfedfklnzkgifpdxrybh.supabase.co ✓

VITE_SUPABASE_ANON_KEY
  └─→ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... ✓

VITE_SUPABASE_SERVICE_ROLE_KEY
  └─→ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... ✓

VITE_API_URL
  └─→ https://gfedfklnzkgifpdxrybh.supabase.co/functions/v1 ✓
```

---

## 🔍 WHAT GETS CREATED

```
DATABASE SCHEMA
├─ Tables (7)
│  ├─ leads
│  ├─ app_settings
│  ├─ user_roles
│  ├─ smtp_config
│  ├─ audit_logs
│  ├─ email_history
│  └─ lead_activities
│
├─ Security (14 RLS Policies)
│  └─ Automatic access control
│
├─ Automation (4 Triggers)
│  └─ Auto timestamp updates
│  └─ Activity logging
│
└─ Performance (13 Indexes)
   └─ Fast queries
   └─ Optimized lookups
```

---

## 🐛 ERROR? FOLLOW THIS

```
ERROR: "Table does not exist"
  ➜ Run Step 1 again
  ➜ Check SQL ran without errors

ERROR: "Connection refused"  
  ➜ Check .env.local exists
  ➜ Verify credentials are correct
  ➜ Restart dev server

ERROR: "VITE_SUPABASE_URL not set"
  ➜ Check .env.local exists in project root
  ➜ Restart npm run dev

ERROR: "Permission denied"
  ➜ Check RLS policies in Supabase dashboard
  ➜ Verify user is authenticated
```

---

## 📚 MORE HELP

Need details? See these files:

```
QUICK_SETUP.md              ← 15 min guide
SUPABASE_CONNECTION.md      ← Complete connection guide
DATABASE_SCHEMA.md          ← Database structure
DEPLOYMENT_NETLIFY.md       ← Production deployment
VERIFY_CONFIG.md            ← Configuration checklist
```

---

## ✅ SUCCESS CHECKLIST

```
Step 1: Create Database
  ☐ Ran: bash scripts/run-migration.sh
  ☐ Copied SQL to Supabase
  ☐ Clicked Run
  ☐ All tables appear in Supabase ✓

Step 2: Test Connection
  ☐ Ran: npx ts-node scripts/test-supabase-connection.ts
  ☐ Saw "All tests passed!" ✓

Step 3: Start Server
  ☐ Ran: npm install
  ☐ Ran: npm run dev
  ☐ Opened http://localhost:5173/
  ☐ Console shows "Connection successful ✓"

🎉 ALL DONE!
```

---

## 🚀 READY?

```
START HERE ➜ STEP 1 ➜ STEP 2 ➜ STEP 3 ➜ SUCCESS
```

**Next**: Run `bash scripts/run-migration.sh` 🚀

---

**Visual Guide Complete!**
For step-by-step commands, see `QUICK_SETUP.md`
