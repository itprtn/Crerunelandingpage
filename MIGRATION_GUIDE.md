# 🚀 GUIDE DE MIGRATION SUPABASE → NEON + NETLIFY

## 📋 Résumé de la Migration

Ce projet a été refactorisé pour utiliser:
- **Base de Données**: Neon PostgreSQL (au lieu de Supabase)
- **Backend**: Express.js + Serverless Functions Netlify
- **Frontend**: React + Vite (inchangé)
- **Authentification**: JWT custom (au lieu de Supabase Auth)

## ✅ Étapes Réalisées

### 1. **Initialisation de Neon**
```bash
# Script SQL créé: scripts/01-init-neon.sql
# Tables créées:
# - users (authentification)
# - leads (formulaire de contact)
# - app_settings (configuration dynamique)
# - user_roles (permissions)
# - smtp_config (configuration email)
# - audit_logs (logs d'audit)
# - api_logs (logs API)
```

### 2. **Configuration Base de Données**
- Client PostgreSQL: `src/lib/postgres-client.ts`
- Utilise la connexion Neon fournie
- Pool de connexions configuré avec SSL

### 3. **Création du Backend**
- **Express Server**: `server.ts` (développement local)
- **Netlify Functions**: `netlify/functions/api.ts` (production)
- Endpoints API:
  - `POST /api/auth/signup` - Inscription
  - `POST /api/auth/signin` - Connexion
  - `GET /api/auth/me` - Profil utilisateur
  - `GET/POST/PUT/DELETE /api/leads` - Gestion des leads
  - `GET/PUT /api/settings` - Configuration

### 4. **Utilitaires Refactorisés**
- `src/utils/postgres.tsx` - Remplace `utils/supabase.tsx`
- Fonctions d'API standardisées
- Authentification via JWT localStorage

### 5. **Pages Mises à Jour**
- ✅ `LandingPage.tsx` - Utilise leadsApi et settingsApi
- ✅ `SignUp.tsx` - Authentification JWT
- ✅ `SignIn.tsx` - Authentification JWT
- ✅ `Admin.tsx` - Authentification et leads
- ✅ `AdminLeads.tsx` - API leads
- ✅ `AdminSettings.tsx` - API settings
- ✅ `AdminAutomation.tsx` - Automatisation
- ✅ `PromoteAdmin.tsx` - Promotion admin

## 🔧 INSTALLATION LOCALE

### 1. Installer les dépendances
```bash
npm install
# ou
pnpm install
```

### 2. Configurer l'environnement
```bash
# Copier le fichier d'exemple
cp .env.example .env.local

# Édi ter .env.local avec vos valeurs:
# DATABASE_URL=postgresql://neondb_owner:...
# JWT_SECRET=votre-secret-change-en-production
```

### 3. Initialiser la base de données Neon
```bash
npm run init-db
```

### 4. Démarrer en développement
```bash
npm run dev
```

Cela lancera:
- Frontend: http://localhost:5173 (Vite)
- Backend: http://localhost:3001 (Express)

## 🌐 DÉPLOIEMENT NETLIFY

### 1. Préparer le projet
```bash
npm run build
npm run build:server
```

### 2. Configurer Netlify
```bash
# Installer la CLI Netlify
npm install -g netlify-cli

# Se connecter
netlify login

# Initialiser le projet
netlify init
```

### 3. Variables d'environnement Netlify
Dans le dashboard Netlify (Settings > Build & deploy > Environment):
```
DATABASE_URL=postgresql://neondb_owner:...
JWT_SECRET=your-production-secret-key
VITE_API_URL=/.netlify/functions/api
NODE_ENV=production
```

### 4. Déployer
```bash
netlify deploy --prod
```

## 📊 STRUCTURE DES BASES DE DONNÉES

### Neon PostgreSQL
```
neondb/
├── users (id, email, password_hash, first_name, last_name)
├── leads (id, first_name, last_name, email, phone, profession, message, status)
├── app_settings (key, value, description, updated_at)
├── user_roles (user_id, role)
├── smtp_config (host, port, from_email, password)
├── audit_logs (user_id, action, resource_type, old_values, new_values)
└── api_logs (method, endpoint, status_code, response_time_ms)
```

## 🔐 AUTHENTIFICATION

### Flux d'authentification
1. **Sign Up**
   - POST `/api/auth/signup` avec email, password, nom
   - Password hashé avec bcrypt
   - JWT token généré
   - Token sauvegardé dans localStorage

2. **Sign In**
   - POST `/api/auth/signin` avec email, password
   - Vérification du password avec bcrypt
   - JWT token généré
   - Redirection vers /admin

3. **Authentification des requêtes**
   - Header: `Authorization: Bearer {token}`
   - Token vérifié côté serveur
   - userId extrait du token

### Rôles
- **user** - Utilisateur standard
- **admin** - Administrateur complet
- **manager** - Manager (à implémenter)

## 🚀 SCRIPTS NPM

```bash
# Développement
npm run dev          # Lance frontend + backend

# Production
npm run build        # Build Vite
npm run build:server # Build serverless functions

# Utilitaires
npm run init-db      # Initialise la base de données Neon
npm run preview      # Préview du build Vite
```

## ⚠️ NOTES IMPORTANTES

### Avant le déploiement production:
1. ✅ Changer `JWT_SECRET` dans `.env.production`
2. ✅ Configurer les variables Netlify
3. ✅ Tester tous les endpoints en local
4. ✅ Vérifier les connexions à la base de données
5. ✅ Mettre en place les logs et monitoring

### Fichiers à NE PAS committar:
- `.env.local` - Contient les secrets
- `node_modules/` - Généré automatiquement
- `dist/` - Build frontend
- `netlify/functions/*.js` - Généré

### Migration de données (si nécessaire):
Si vous aviez des données dans Supabase:
1. Exporter les données de Supabase
2. Adapter le format si nécessaire
3. Importer dans Neon avec un script SQL

## 🔍 TROUBLESHOOTING

### Erreur: "Database connection failed"
- Vérifier `DATABASE_URL` dans `.env.local`
- Vérifier que Neon est accessible
- Tester la connexion: `psql <DATABASE_URL>`

### Erreur: "JWT token invalid"
- Vérifier que `JWT_SECRET` est le même côté client et serveur
- Vérifier que le token est envoyé dans le header Authorization
- Tokens JWT expirent après 7 jours

### Erreur: "Lead with this email already exists"
- Email doit être unique dans la table leads
- Vérifier qu'il n'existe pas déjà

## 📞 SUPPORT

Pour plus d'informations:
- Neon Docs: https://neon.tech/docs
- Express.js: https://expressjs.com
- Netlify Functions: https://docs.netlify.com/functions/overview
- React Query: https://tanstack.com/query/latest
