# 🎯 Premunia CRM - Guide Complet d'Installation

**Un CRM complet pour les leads PER (Plan Épargne Retraite) avec Supabase et Netlify**

---

## ⚡ Vue rapide (5 minutes)

### Pour les impatients

```bash
# 1. Installer localement
git clone https://github.com/investassur/Crerunelandingpage.git && cd Crerunelandingpage
npm install && npm run dev

# 2. Créer Supabase (https://supabase.com)
# Copier les clés dans .env.local

# 3. Exécuter le script SQL
# Copier scripts/01-init-supabase.sql dans Supabase SQL Editor

# 4. Déployer sur Netlify (https://netlify.com)
# Connecter votre repo GitHub
# Ajouter les variables d'environnement
```

✅ C'est fait ! Vous avez un CRM fonctionnel.

---

## 📚 Guides complets

| Document | Durée | Description |
|----------|-------|-------------|
| **SETUP_COMPLETE.md** | ⏱️ 45 min | Guide étape par étape complète |
| **DEPLOYMENT_NETLIFY.md** | ⏱️ 30 min | Déploiement détaillé sur Netlify |
| **DATABASE_SCHEMA.md** | ⏱️ 20 min | Documentation complète du schéma DB |
| **README_ARCHITECTURE.md** | ⏱️ 15 min | Architecture technique |
| **QUICKSTART.md** | ⏱️ 5 min | Utilisation du CRM |

---

## 🎉 Ce que vous allez obtenir

### ✨ Landing Page Publique
- Design moderne avec charte Premunia (Rouge #EE3B33, Orange #F79E1B)
- Formulaire de contact fonctionnel
- Graphique de simulation fiscale (Recharts)
- 100% responsive (mobile, tablette, desktop)

### 🔐 Système d'Authentification
- Inscription et connexion sécurisées (Supabase Auth)
- Sessions gérées automatiquement
- Protection des routes admin

### 📊 Dashboard Admin
- Statistiques en temps réel
- Vue d'ensemble des leads
- Accès à tous les outils

### 👥 Gestion des Leads
- **Create** : Formulaire public
- **Read** : Liste complète avec recherche
- **Update** : Modification de statut et notes
- **Delete** : Suppression sécurisée

### ⚙️ Paramètres
- Personnalisation du site (textes)
- Configuration SMTP (emails)
- Gestion des utilisateurs

---

## 🛠️ Stack Technique

```
Frontend
├── React 18.3.1
├── React Router 7 (Data mode)
├── TanStack React Query (Cache + Mutations)
├── Tailwind CSS v4
├── Recharts (Graphiques)
├── Lucide React (Icônes)
└── Radix UI (Composants)

Backend
├── Supabase (PostgreSQL)
├── Edge Functions (Hono + Deno)
└── Auth JWT

Déploiement
├── Frontend: Netlify
└── Backend: Supabase Edge Functions
```

---

## 🚀 Commencer maintenant

### Option 1 : Guide rapide (Recommandé)

👉 **Allez directement à `SETUP_COMPLETE.md`** pour un guide pas à pas.

### Option 2 : Installation manuelle

#### Étape 1 : Cloner et installer

```bash
# Cloner le repo
git clone https://github.com/investassur/Crerunelandingpage.git
cd Crerunelandingpage

# Installer les dépendances
npm install
```

#### Étape 2 : Supabase

1. Créer un compte sur https://supabase.com
2. Créer un nouveau projet
3. Copier les clés (URL et Anon Key)
4. Exécuter le script : `scripts/01-init-supabase.sql`

#### Étape 3 : Configuration locale

```bash
# Créer .env.local
cp .env.example .env.local

# Remplir avec vos clés Supabase
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_API_URL=...
```

#### Étape 4 : Tester localement

```bash
npm run dev
# Ouvrir http://localhost:5173
```

#### Étape 5 : Déployer sur Netlify

1. Pousser le code vers GitHub
2. Créer un site Netlify connecté à GitHub
3. Ajouter les variables d'environnement
4. Redéployer

---

## 📁 Structure du projet

```
Crerunelandingpage/
├── 📄 SETUP_COMPLETE.md           ← START HERE
├── 📄 DEPLOYMENT_NETLIFY.md       ← Netlify guide
├── 📄 DATABASE_SCHEMA.md          ← DB documentation
├── 📄 README_ARCHITECTURE.md      ← Tech architecture
│
├── netlify.toml                   ← Netlify config
├── .env.example                   ← Environment template
│
├── scripts/
│   └── 01-init-supabase.sql      ← ⭐ SQL migration
│
├── src/
│   ├── app/
│   │   ├── App.tsx               ← React entry point
│   │   ├── routes.ts             ← Router config
│   │   │
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx   ← Homepage
│   │   │   ├── SignIn.tsx        ← Login
│   │   │   ├── SignUp.tsx        ← Registration
│   │   │   ├── Admin.tsx         ← Dashboard
│   │   │   ├── AdminLeads.tsx    ← Lead management
│   │   │   ├── AdminSettings.tsx ← Site settings
│   │   │   ├── AdminAutomation.tsx ← SMTP config
│   │   │   └── PromoteAdmin.tsx  ← ⚠️ To delete
│   │   │
│   │   └── components/            ← UI components
│   │
│   ├── utils/
│   │   └── supabase.tsx           ← API client
│   │
│   └── styles/
│       ├── index.css              ← Global styles
│       ├── theme.css              ← Theme variables
│       └── fonts.css              ← Fonts import
│
├── supabase/
│   └── functions/server/
│       ├── index.tsx              ← Backend API (Hono)
│       └── kv_store.tsx           ← Data storage (protected)
│
├── utils/
│   └── supabase/info.tsx          ← Config (protected)
│
└── package.json                   ← Dependencies
```

---

## 🔑 Variables d'environnement

### Requises

```bash
VITE_SUPABASE_URL       # URL du projet Supabase
VITE_SUPABASE_ANON_KEY  # Clé publique Supabase
VITE_API_URL            # URL du backend (Edge Functions)
```

### Optionnelles

```bash
VITE_PORT               # Port de développement (défaut: 5173)
VITE_GA_ID              # Google Analytics (optionnel)
VITE_PLAUSIBLE_DOMAIN   # Plausible Analytics (optionnel)
```

---

## 📊 Schéma de base de données

7 tables principales :

| Table | Description |
|-------|-------------|
| `leads` | Prospects/leads |
| `app_settings` | Paramètres du site |
| `user_roles` | Rôles (admin/user) |
| `smtp_config` | Configuration email |
| `audit_logs` | Journal d'audit |
| `email_history` | Historique des emails |
| `lead_activities` | Activités sur les leads |

👉 Voir `DATABASE_SCHEMA.md` pour les détails.

---

## 🔐 Sécurité

### ⚠️ À faire immédiatement

1. **Supprimer la page de promotion admin**
   ```bash
   rm src/app/pages/PromoteAdmin.tsx
   ```

2. **Retirer la route**
   - Ouvrir `src/app/routes.ts`
   - Supprimer l'import et la route

### Bonnes pratiques

- ✅ Authentification JWT (Supabase Auth)
- ✅ Row Level Security (RLS) sur toutes les tables
- ✅ Mot de passe SMTP chiffré
- ✅ CORS configuré
- ✅ Logs d'audit automatiques

---

## 🎓 Tutoriels par sujet

### Pour commencer
- [x] SETUP_COMPLETE.md - Installation complète
- [x] QUICKSTART.md - Utilisation du CRM

### Pour déployer
- [x] DEPLOYMENT_NETLIFY.md - Netlify + Supabase
- [x] netlify.toml - Configuration de build

### Pour comprendre
- [x] README_ARCHITECTURE.md - Architecture technique
- [x] DATABASE_SCHEMA.md - Schéma de DB

---

## 🔄 Commandes utiles

```bash
# Développement
npm run dev                 # Serveur de dev (http://localhost:5173)
npm run build              # Build production
npm run preview            # Prévisualiser le build

# Linting & Formatting
npm run lint               # Vérifier les erreurs
npm run format             # Formater le code

# Git
git add -A                 # Stage tous les changements
git commit -m "message"    # Committer
git push origin main       # Pousser vers GitHub
```

---

## 📞 Support & Documentation

### Ressources externes
- **Supabase** : https://supabase.com/docs
- **Netlify** : https://docs.netlify.com
- **React Router** : https://reactrouter.com/docs
- **React Query** : https://tanstack.com/query/latest
- **Tailwind CSS** : https://tailwindcss.com/docs

### Documentation locale
- `README_ARCHITECTURE.md` - Architecture technique
- `DATABASE_SCHEMA.md` - Schéma complet
- `DEPLOYMENT_NETLIFY.md` - Déploiement

---

## ✅ Checklist d'installation

- [ ] Cloner le repo
- [ ] Installer npm
- [ ] Créer Supabase
- [ ] Exécuter le script SQL
- [ ] Configurer .env.local
- [ ] Tester localement
- [ ] Créer Netlify
- [ ] Ajouter variables d'environnement
- [ ] Déployer
- [ ] **SUPPRIMER PromoteAdmin.tsx**
- [ ] Tester en production
- [ ] Configurer SMTP
- [ ] Configurer domaine (optionnel)

---

## 🎉 Prochaines étapes

1. **Suivez SETUP_COMPLETE.md** pour une installation guidée
2. **Lisez QUICKSTART.md** pour utiliser le CRM
3. **Consultez DATABASE_SCHEMA.md** pour comprendre les données

---

## 📊 Statistiques

```
Temps d'installation: 45 minutes
Nombre de tables: 7
Nombre de fonctions: 2
Nombre de triggers: 4
Nombre de policies RLS: 11
Lignes de SQL: 250+
```

---

## 🚀 Status

```
✅ Frontend - Complet
✅ Backend API - Complet  
✅ Authentication - Complet
✅ Database - Complet
✅ Deployment - Prêt
⏳ Email automation - Futur
⏳ Multi-users - Futur
⏳ Webhooks - Futur
```

---

## 📄 Licence

© 2026 Premunia. Tous droits réservés.

---

**Développé avec ❤️ pour Premunia**

Prêt à commencer ? 👉 **Ouvrez `SETUP_COMPLETE.md`** 🚀
