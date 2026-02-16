# 🎯 PREMUNIA CRM - Neon + Netlify Edition

## 📦 Status: ✅ Fully Refactored & Ready for Deployment

### Ce qui a changé:
- ✅ **Base de données**: Supabase → **Neon PostgreSQL**
- ✅ **Backend**: Supabase Edge Functions → **Express.js + Netlify Serverless Functions**
- ✅ **Authentification**: Supabase Auth → **JWT Custom**
- ✅ **Frontend**: React + Vite (inchangé)

---

## 🚀 QUICK START

### 1. Installation
```bash
npm install
# ou
pnpm install
```

### 2. Configuration Locale
```bash
# Le fichier .env.local est déjà configuré avec Neon
# Vérifiez les valeurs:
cat .env.local
```

### 3. Initialiser la Base de Données
```bash
npm run init-db
```

### 4. Démarrer en Développement
```bash
npm run dev
```

Cela lancera:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

### 5. Tester
```bash
# Aller à http://localhost:5173
# Cliquer sur "Se connecter" ou "Créer un compte"
# Tester le formulaire de contact sur la page d'accueil
```

---

## 🌐 DÉPLOIEMENT NETLIFY

### Prérequis:
1. Compte GitHub avec ce projet
2. Compte Netlify
3. Accès à Neon (base de données déjà créée)

### Étapes:

#### 1. Connecter GitHub à Netlify
```
https://app.netlify.com → New site from Git → GitHub → Authorize
```

#### 2. Configurer Build Settings
- Build command: `npm run build && npm run build:server`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

#### 3. Ajouter les Variables d'Environnement
Dans Netlify Dashboard → Settings → Build & Deploy → Environment:

```env
DATABASE_URL=postgresql://neondb_owner:npg_KPsQzMwm07tj@ep-muddy-base-aenbm79t-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET=<VOTRE_SECRET_UNIQUE_LONG_ET_SECURISE>

VITE_API_URL=/.netlify/functions/api

NODE_ENV=production
```

#### 4. Déclencher le Build
```bash
git push origin main
```

Netlify déploiera automatiquement! 🎉

#### 5. Tester le Site Déployé
```bash
# Accéder à votre site
https://votre-nom-site.netlify.app

# Tester l'API
curl https://votre-nom-site.netlify.app/.netlify/functions/api/health
```

---

## 📁 Structure du Projet

```
.
├── src/
│   ├── app/
│   │   ├── pages/              # Pages React
│   │   │   ├── LandingPage.tsx  # ✅ Migré
│   │   │   ├── SignUp.tsx       # ✅ Migré
│   │   │   ├── SignIn.tsx       # ✅ Migré
│   │   │   ├── Admin.tsx        # ✅ Migré
│   │   │   ├── AdminLeads.tsx   # ✅ Migré
│   │   │   └── ...
│   │   └── components/
│   ├── lib/
│   │   └── postgres-client.ts   # ✅ Client Neon
│   ├── utils/
│   │   └── postgres.tsx         # ✅ Utilitaires API
│   └── ...
├── server.ts                    # Express (développement)
├── netlify/
│   └── functions/
│       └── api.ts              # Serverless functions (production)
├── scripts/
│   ├── 01-init-neon.sql        # Schéma SQL Neon
│   ├── init-neon.ts            # Initialise la DB
│   └── test-neon-connection.ts # Test la connexion
├── .env.local                  # Variables locales
├── .env.example                # Template
├── package.json                # ✅ Mis à jour
├── netlify.toml                # ✅ Configuration Netlify
├── vite.config.ts              # Vite config
└── MIGRATION_GUIDE.md          # Documentation détaillée
```

---

## 📚 Documentation

- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Guide complet de migration
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Checklist de déploiement
- **[.env.example](./.env.example)** - Variables d'environnement

---

## 🔐 Sécurité

### Authentification
- Passwords hashés avec **bcrypt** (10 rounds)
- JWT tokens avec expiration 7 jours
- LocalStorage pour la persistance du token

### Base de Données
- Connection SSL/TLS à Neon
- Parameterized queries (protection SQL injection)
- Audit logs pour toutes les actions sensibles

### Secrets
- ❌ Jamais commiter `.env.local`
- ✅ `.env.local` dans `.gitignore`
- ✅ JWT_SECRET unique en production
- ✅ Variables d'environnement Netlify sécurisées

---

## 🛠️ Scripts Disponibles

```bash
# Développement
npm run dev                # Frontend + Backend

# Production
npm run build             # Build frontend Vite
npm run build:server      # Build serverless functions
npm run preview           # Preview build local

# Utilitaires
npm run init-db          # Initialise la base de données Neon
npm run test-db          # Test la connexion à Neon
```

---

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/signup      - Créer un compte
POST   /api/auth/signin      - Se connecter
GET    /api/auth/me          - Profil utilisateur (authentifié)
```

### Leads
```
GET    /api/leads            - Tous les leads (authentifié)
POST   /api/leads            - Créer un lead (public)
PUT    /api/leads/:id        - Modifier un lead (authentifié)
DELETE /api/leads/:id        - Supprimer un lead (authentifié)
```

### Settings
```
GET    /api/settings         - Tous les paramètres
PUT    /api/settings/:key    - Modifier un paramètre (authentifié)
```

### Health
```
GET    /api/health           - Vérifier l'API
```

---

## 🧪 Tester Localement

```bash
# 1. Lancer le serveur
npm run dev

# 2. Créer un compte (dans un autre terminal)
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe"
  }'

# 3. Se connecter
curl -X POST http://localhost:3001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# 4. Créer un lead (public - pas d'authentification)
curl -X POST http://localhost:3001/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@example.com",
    "phone": "06 12 34 56 78",
    "profession": "Avocate",
    "message": "Intéressée par les services PER"
  }'

# 5. Récupérer les leads (authentifié)
curl -X GET http://localhost:3001/api/leads \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

## ⚠️ Important

### Avant la Mise en Production:
1. ✅ Changer `JWT_SECRET` en valeur unique et sécurisée
2. ✅ Tester tous les endpoints
3. ✅ Configurer les variables Netlify
4. ✅ Vérifier les logs Netlify
5. ✅ Valider les performances

### À Ne Pas Oublier:
- Garder `.env.local` hors du repository
- Monitorer les erreurs en production
- Configurer les backups Neon
- Planifier la maintenance

---

## 🆘 Troubleshooting

### "Database connection failed"
```bash
# Tester la connexion
npm run test-db

# Vérifier DATABASE_URL
echo $DATABASE_URL
```

### "JWT token invalid"
- Vérifier que `JWT_SECRET` est identique côté client et serveur
- Vérifier l'expiration du token (7 jours)
- Tester avec un nouveau token

### Frontend ne communique pas avec Backend
- Vérifier que le backend tourne: `curl http://localhost:3001/api/health`
- Vérifier `VITE_API_URL` dans `.env.local`
- Vérifier les CORS headers

---

## 📞 Support

- **Netlify**: https://docs.netlify.com
- **Neon**: https://neon.tech/docs
- **Express**: https://expressjs.com
- **React Query**: https://tanstack.com/query

---

## ✨ Prochaines Étapes

1. [ ] Déployer sur Netlify
2. [ ] Configurer le domaine personnalisé
3. [ ] Ajouter SSL/HTTPS (automatique avec Netlify)
4. [ ] Configurer les emails (SMTP)
5. [ ] Ajouter Google Analytics
6. [ ] Configurer les alertes
7. [ ] Planifier les backups

---

**Bonne chance! 🚀**
