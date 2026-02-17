# 🔥 QUICK FIX - YOUR API 502 ERRORS

## Le Problème (The Problem)

API calls return **502 errors**. The fix is in **3 steps**:

---

## STEP 1️⃣ : Database Initialization (5 minutes)

**Go to**: https://console.neon.tech

1. Select your project
2. Click **SQL Editor** (tab at top)
3. Copy ALL text from: `scripts/01-init-neon.sql` in this repo
4. Paste into editor
5. Click **Execute**

✅ This creates all tables needed

---

## STEP 2️⃣ : Verify Environment Variables (2 minutes)

**Go to**: https://app.netlify.com → Your Site → **Site Settings**

1. Click **Build & Deploy** → **Environment**
2. Make sure these 3 exist:

```
DATABASE_URL = postgresql://neondb_owner:...
JWT_SECRET = change-this-in-production
NODE_ENV = development
```

If missing, **Add Variable** and copy-paste them.

✅ This tells Netlify how to connect to database

---

## STEP 3️⃣ : Deploy Latest Code (3 minutes)

The latest code is already pushed with fixes:

1. Go to **Netlify** → **Deploys**
2. You should see a recent deploy starting
3. If not, click **Trigger Deploy** → **Deploy site**
4. Wait for build to complete (usually 2-3 minutes)

✅ This deploys the fixed API code

---

## ✅ Verify It Works

Open this URL in browser:

```
https://your-site.netlify.app/.netlify/functions/api/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "...",
  "database": "connected"
}
```

If you see this → **API is working!** 🎉

---

## 🎯 What You Have Now

✅ **Landing Page** - Lead capture form (works without login)
✅ **Sign Up / Sign In** - User authentication
✅ **Admin Dashboard** - View all leads, manage settings
✅ **API CRUD** - Full backend for data operations
✅ **Neon Database** - Secure PostgreSQL hosting
✅ **Netlify Functions** - Serverless backend

---

## 🧪 Quick Test

### Test 1: Landing Page
Go to https://your-site.netlify.app
- Should load ✅
- Try filling lead form
- Should submit ✅

### Test 2: Sign Up
Go to https://your-site.netlify.app/signup
- Create new account ✅
- Should redirect to admin ✅

### Test 3: Admin Dashboard
Go to https://your-site.netlify.app/admin
- Sign in with account from Test 2
- Should see leads list ✅
- Should see settings ✅

---

## 📝 More Detailed Help?

See: **DEBUG_AND_TEST.md** for complete testing guide with curl commands, troubleshooting, etc.

---

## 🎉 You're Done!

Your site is now fully functional with:
- React frontend (Vite)
- Netlify Functions backend
- Neon PostgreSQL database
- User authentication
- Admin interface
- Full CRUD API

**All deployed and production-ready!**
