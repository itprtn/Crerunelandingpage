# ✅ CHECKLIST DE DÉPLOIEMENT NETLIFY

## 📋 Avant le Déploiement

### 1. Préparation Locale
- [ ] `npm install` - Toutes les dépendances installées
- [ ] `npm run build` - Build frontend sans erreurs
- [ ] `npm run build:server` - Build serverless functions sans erreurs
- [ ] `npm run init-db` - Base de données Neon initialisée
- [ ] `npm run dev` - Tests locaux du frontend + backend
- [ ] Tester tous les endpoints:
  - [ ] POST `/api/auth/signup` - Créer un compte
  - [ ] POST `/api/auth/signin` - Se connecter
  - [ ] GET `/api/leads` - Récupérer les leads (authentifié)
  - [ ] POST `/api/leads` - Créer un lead (public)
  - [ ] GET `/api/settings` - Récupérer les paramètres

### 2. Configuration Netlify

#### Compte et Projet
- [ ] Compte Netlify créé (https://netlify.com)
- [ ] Projet GitHub connecté à Netlify
- [ ] Branche de production configurée
- [ ] Build triggers configurés

#### Variables d'Environnement
Dashboard Netlify → Settings → Build & Deploy → Environment

```
DATABASE_URL=postgresql://neondb_owner:npg_KPsQzMwm07tj@ep-muddy-base-aenbm79t-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET=<CHANGEZ_CETTE_VALEUR_EN_PRODUCTION>

VITE_API_URL=/.netlify/functions/api

NODE_ENV=production
```

- [ ] Chaque variable a été vérifiée
- [ ] JWT_SECRET est unique et sécurisé
- [ ] DATABASE_URL est correcte

#### Configuration Build
Dashboard Netlify → Settings → Build & Deploy → Build Settings

- [ ] Build command: `npm run build && npm run build:server`
- [ ] Publish directory: `dist`
- [ ] Functions directory: `netlify/functions`

### 3. Vérifications de Sécurité

- [ ] `.env.local` n'est pas commité (dans `.gitignore`)
- [ ] `.env.example` ne contient que des placeholders
- [ ] JWT_SECRET est suffisamment long (min. 32 caractères)
- [ ] Password hashing avec bcrypt configuré
- [ ] CORS correctement configuré
- [ ] SQL injection protection en place (parameterized queries)

### 4. Préparation Neon

- [ ] Base de données Neon créée
- [ ] Tables créées avec script `01-init-neon.sql`
- [ ] Connexion SSL configurée
- [ ] Backups automatiques activés
- [ ] Monitoring configuré

### 5. Git et Version Control

- [ ] Tout le code committé: `git status` vide
- [ ] Pas de secrets dans les commits
- [ ] Branch production à jour
- [ ] Tag de version créé (optionnel): `git tag v1.0.0`

## 🚀 Processus de Déploiement

### Option 1: Déploiement via Git (Recommandé)

```bash
# 1. Commit et push vers GitHub
git add .
git commit -m "Refactor: Migrate Supabase to Neon + Netlify serverless"
git push origin main

# 2. Netlify détecte automatiquement la modification
# 3. Build et déploiement automatiques
# 4. Vérifier les logs dans Netlify dashboard
```

### Option 2: Déploiement via CLI

```bash
# 1. Installer Netlify CLI
npm install -g netlify-cli

# 2. Se connecter
netlify login

# 3. Linker le projet (si pas déjà fait)
netlify link

# 4. Déployer
netlify deploy --prod

# 5. Vérifier l'URL
# https://votre-site.netlify.app
```

## 🧪 Tests Post-Déploiement

### 1. Vérifier le Site
- [ ] Frontend accesible: https://votre-site.netlify.app
- [ ] Page d'accueil charge correctement
- [ ] Navigation fonctionne

### 2. Tester les Endpoints API
```bash
# Health check
curl https://votre-site.netlify.app/.netlify/functions/api/health

# Sign up (public)
curl -X POST https://votre-site.netlify.app/.netlify/functions/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "first_name": "Test",
    "last_name": "User"
  }'

# Sign in
curl -X POST https://votre-site.netlify.app/.netlify/functions/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

### 3. Tester les Fonctionnalités Core
- [ ] Sign up fonctionne
- [ ] Sign in fonctionne
- [ ] Formulaire de contact envoie les données
- [ ] Admin can view leads
- [ ] Admin can edit leads
- [ ] Settings page functional

### 4. Vérifier les Logs
Dashboard Netlify → Functions → Logs
- [ ] Pas d'erreurs critiques
- [ ] Les requêtes sont traitées correctement
- [ ] Les erreurs sont loggées

### 5. Monitoring
- [ ] Google Analytics configuré (optionnel)
- [ ] Sentry configuré pour error tracking (optionnel)
- [ ] Alertes email configurées pour les erreurs

## 🔧 Maintenance Après Déploiement

### Quotidien
- [ ] Vérifier les logs des erreurs
- [ ] Vérifier les nouveaux leads

### Hebdomadaire
- [ ] Vérifier les performances (Netlify Analytics)
- [ ] Vérifier l'usage de la base de données Neon

### Mensuellement
- [ ] Vérifier les backups Neon
- [ ] Vérifier les coûts Netlify et Neon
- [ ] Vérifier les mises à jour de sécurité

## ❌ Troubleshooting Déploiement

### Erreur: "Build failed"
1. Vérifier les logs Netlify
2. Vérifier `npm run build` en local
3. Vérifier les variables d'environnement
4. Vérifier les permissions d'accès au repo

### Erreur: "Database connection failed"
1. Vérifier DATABASE_URL dans Netlify
2. Vérifier que Neon est accessible
3. Vérifier les logs des functions

### Erreur: "JWT token invalid"
1. Vérifier que JWT_SECRET est le même partout
2. Vérifier que le token est envoyé correctement
3. Vérifier que le token n'a pas expiré

### Site lent
1. Vérifier les logs Netlify
2. Vérifier l'utilisation CPU de Neon
3. Considérer l'ajout de caching
4. Optimiser les queries SQL

## 📞 Support & Documentation

- **Netlify Docs**: https://docs.netlify.com
- **Neon Docs**: https://neon.tech/docs
- **Netlify Status**: https://www.netlify.com/status
- **Neon Status**: https://status.neon.tech

## 📝 Notes

- Gardez un log des modifications déployées
- Documentez toute configuration personnalisée
- Planifiez les mises à jour de sécurité
- Testez les changements avant de deployer en prod
