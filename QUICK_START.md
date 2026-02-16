# 🚀 QUICK START - NEON + NETLIFY

## En 30 secondes

```bash
# 1. Installer les dépendances
npm install

# 2. Initialiser la BD Neon
npm run init-db

# 3. Lancer en développement
npm run dev
```

Puis ouvrez http://localhost:5173 🎉

---

## En 5 minutes - Déployer sur Netlify

```bash
# 1. Configurer Netlify (https://app.netlify.com)
#    - Connecter GitHub
#    - Ajouter variables d'environnement:
#      DATABASE_URL=...
#      JWT_SECRET=votre_secret_unique
#      VITE_API_URL=/.netlify/functions/api
#      NODE_ENV=production

# 2. Push vers GitHub
git add .
git commit -m "Refactor: Migrate to Neon + Netlify"
git push origin main

# 3. Netlify déploie automatiquement ✅
```

---

## Architecture

```
┌─────────────────────────────────────┐
│   React Frontend (Vite)             │
│   http://localhost:5173             │
└──────────┬──────────────────────────┘
           │ API calls
           ↓
┌─────────────────────────────────────┐
│   Express Backend (Dev)             │
│   http://localhost:3001             │
│   OR                                │
│   Netlify Functions (Prod)          │
│   /.netlify/functions/api           │
└──────────┬──────────────────────────┘
           │ SQL queries
           ↓
┌─────────────────────────────────────┐
│   Neon PostgreSQL                   │
│   (Cloud Database)                  │
└─────────────────────────────────────┘
```

---

## Endpoints API

### Auth
```bash
POST /api/auth/signup
POST /api/auth/signin
GET  /api/auth/me
```

### Leads
```bash
GET    /api/leads              # Authenticated
POST   /api/leads              # Public
PUT    /api/leads/:id          # Authenticated
DELETE /api/leads/:id          # Authenticated
```

### Settings
```bash
GET /api/settings
PUT /api/settings/:key         # Authenticated
```

---

## Variables d'Environnement

### .env.local (Développement)
```env
DATABASE_URL=postgresql://neondb_owner:npg_KPsQzMwm07tj@ep-muddy-base-aenbm79t-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
VITE_API_URL=http://localhost:3001
JWT_SECRET=your-secret-key
PORT=3001
NODE_ENV=development
```

### Netlify Dashboard (Production)
```
DATABASE_URL=<Neon connection string>
JWT_SECRET=<Unique secure key>
VITE_API_URL=/.netlify/functions/api
NODE_ENV=production
```

---

## Scripts NPM

```bash
npm run dev              # Développement (Frontend + Backend)
npm run build           # Build Vite
npm run build:server    # Build Netlify functions
npm run init-db         # Initialiser la BD Neon
npm run preview         # Préview du build
```

---

## Tests Locaux

```bash
# Test Sign Up
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123","first_name":"John","last_name":"Doe"}'

# Test Sign In
curl -X POST http://localhost:3001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'

# Test Create Lead
curl -X POST http://localhost:3001/api/leads \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Jane","last_name":"Smith","email":"jane@test.com","phone":"06 12 34 56 78","profession":"Avocate","message":"Interested"}'

# Test Get Leads (need token from sign in)
curl -X GET http://localhost:3001/api/leads \
  -H "Authorization: Bearer <TOKEN>"
```

---

## Troubleshooting

### "npm not found"
→ Installer Node.js depuis https://nodejs.org

### "Database connection failed"
→ Vérifier DATABASE_URL dans .env.local
→ Tester avec: `npm run test-db`

### "Port 3001 already in use"
→ Changer PORT dans .env.local

### "CORS error"
→ Vérifier VITE_API_URL dans .env.local
→ Vérifier CORS headers dans server.ts

---

## Documentation Complète

- **MIGRATION_GUIDE.md** - Guide détaillé
- **DEPLOYMENT_CHECKLIST.md** - Avant déployer
- **README_NEON_NETLIFY.md** - Référence complète
- **REFACTORING_SUMMARY.md** - Ce qui a changé

---

## Status

✅ **Prêt pour le déploiement en production!**

Éléments complétés:
- ✅ Migration Supabase → Neon
- ✅ Backend Express + Netlify Functions
- ✅ Authentification JWT
- ✅ Toutes les pages refactorisées
- ✅ Documentation complète
- ✅ Configuration Netlify

---

**Next Step**: `npm run init-db` puis `npm run dev` 🎉
