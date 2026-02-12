# 🚀 QUICK SETUP - 15 Minutes

**Your Supabase credentials are already configured!** ✅

Follow these 3 steps to get everything running.

---

## 📝 Step 1: Create Database Tables (5 min)

```bash
# Show SQL to copy/paste
bash scripts/run-migration.sh
```

Then:
1. Go to: https://supabase.com/dashboard
2. Select project: **gfedfklnzkgifpdxrybh**
3. Click **SQL Editor** → **New Query**
4. Copy all SQL code from terminal
5. Paste and click **Run**

✅ All 8 tables created!

---

## ✅ Step 2: Test Connection (5 min)

```bash
# Run connection test
npx ts-node scripts/test-supabase-connection.ts
```

Should see:
```
✓ VITE_SUPABASE_URL is set
✓ Database query successful
✓ All tests passed!
```

---

## 🧪 Step 3: Start Dev Server (5 min)

```bash
npm install
npm run dev
```

Open: http://localhost:5173

Browser console (F12) should show:
```
[Supabase] Connection successful ✓
```

---

## 🎉 Done!

Your setup is complete!

---

## 📚 Learn More

- **Full guide**: `SUPABASE_CONNECTION.md`
- **Database schema**: `DATABASE_SCHEMA.md`
- **Deployment**: `DEPLOYMENT_NETLIFY.md`

---

**Ready?** Start with Step 1! 🚀
