# ✅ Setup Complet - Premunia CRM

Guide étape par étape pour configurer complètement votre CRM Premunia avec Supabase et Netlify.

---

## 📦 Structure des fichiers de configuration

```
/
├── scripts/
│   └── 01-init-supabase.sql          # ⭐ Migration SQL complète
├── netlify.toml                       # Configuration Netlify
├── .env.example                       # Template des variables
├── DEPLOYMENT_NETLIFY.md              # Guide de déploiement
├── SETUP_COMPLETE.md                  # Ce fichier
├── README_ARCHITECTURE.md             # Documentation technique
└── src/
    └── utils/supabase/info.tsx        # Configuration Supabase
```

---

## 🚀 PHASE 1 : Configuration Locale (5 minutes)

### Étape 1.1 : Cloner et installer

```bash
# Cloner le repo
git clone https://github.com/investassur/Crerunelandingpage.git
cd Crerunelandingpage

# Installer les dépendances
npm install
# ou avec pnpm
pnpm install
```

### Étape 1.2 : Créer le fichier .env.local

```bash
# Créer le fichier en copiant le template
cp .env.example .env.local
```

⚠️ **Ne pas commiter `.env.local`** - Il contient des secrets !

### Étape 1.3 : Tester localement

```bash
npm run dev
```

Ouvrez http://localhost:5173 - vous devriez voir la landing page.

---

## 🌐 PHASE 2 : Configuration Supabase (10 minutes)

### Étape 2.1 : Créer un compte Supabase

1. Allez sur https://supabase.com/auth/sign-up
2. Créez un compte gratuit
3. Vérifiez votre email

### Étape 2.2 : Créer un projet

1. Cliquez sur **"New Project"**
2. Remplissez :
   - **Project name** : `premunia-crm`
   - **Password** : Générez un mot de passe fort
   - **Region** : `Europe (Paris)` ou votre région
3. Attendez la création (2-3 minutes)

### Étape 2.3 : Récupérer vos clés

1. Allez dans **Settings** (en bas à gauche) → **API**
2. Copiez les clés :
   ```
   Project URL: https://xxxxxxxxxxx.supabase.co
   Anon Key: eyJhbGciOiJIUzI1NiI...
   Service Role Key: eyJhbGciOiJIUzI1NiI... (à ne pas partager)
   ```

### Étape 2.4 : Mettre à jour votre configuration locale

Modifiez `.env.local` :

```bash
VITE_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiI...
VITE_API_URL=https://xxxxxxxxxxx.supabase.co/functions/v1
```

### Étape 2.5 : Initialiser la base de données

#### Option A : Via SQL Editor (Recommandé)

1. Dans Supabase, allez dans **SQL Editor** (menu gauche)
2. Cliquez sur **"New Query"**
3. Ouvrez le fichier `scripts/01-init-supabase.sql`
4. Copiez-collez TOUT le contenu dans l'éditeur
5. Cliquez sur **"Run"**

✅ Attendez que le script se termine (quelques secondes)

#### Option B : Via CLI Supabase (Avancé)

```bash
# Installer Supabase CLI
brew install supabase/tap/supabase  # macOS
# ou pour d'autres OS: https://supabase.com/docs/guides/cli/getting-started

# Se connecter
supabase login

# Lier le projet
supabase link

# Exécuter les migrations
supabase db push
```

### Étape 2.6 : Vérifier l'installation

1. Dans Supabase, allez dans **Table Editor**
2. Vérifiez que vous voyez les tables :
   - ✅ `leads`
   - ✅ `app_settings`
   - ✅ `user_roles`
   - ✅ `smtp_config`
   - ✅ `audit_logs`
   - ✅ `email_history`
   - ✅ `lead_activities`

---

## 🔑 PHASE 3 : Test Local avec Supabase (5 minutes)

### Étape 3.1 : Tester la connexion

```bash
# Assurez-vous que le serveur de dev est en cours d'exécution
npm run dev
```

### Étape 3.2 : Tester les fonctionnalités

1. **Landing page** : http://localhost:5173
   - Remplissez et soumettez le formulaire de lead
   - Vérifiez dans Supabase > Table Editor > `leads`

2. **Inscription** : http://localhost:5173/signup
   - Créez un compte
   - Utilisez votre email de test

3. **Connexion** : http://localhost:5173/signin
   - Connectez-vous avec vos identifiants

4. **Dashboard** : http://localhost:5173/admin
   - Vous devriez voir une erreur (pas encore admin)

### Étape 3.3 : Promotion admin locale

1. Allez sur http://localhost:5173/promote-admin
2. Cliquez sur **"Me promouvoir en Admin"**
3. Vous êtes redirigé vers `/admin` ✅

---

## ☁️ PHASE 4 : Déploiement sur Netlify (10 minutes)

### Étape 4.1 : Préparer le code pour le déploiement

```bash
# S'assurer que tout est à jour
git status

# Ajouter les fichiers de configuration
git add scripts/01-init-supabase.sql
git add netlify.toml
git add DEPLOYMENT_NETLIFY.md
git add .env.example

# Committer
git commit -m "Add Supabase database schema and Netlify configuration"

# Pousser vers GitHub
git push origin main
```

### Étape 4.2 : Connecter Netlify à GitHub

1. Allez sur https://netlify.com
2. Cliquez sur **"Add new site"**
3. Sélectionnez **"Import an existing project"**
4. Autorisez Netlify à accéder à GitHub
5. Sélectionnez **`investassur/Crerunelandingpage`**
6. Cliquez sur **"Deploy site"**

Netlify va utiliser automatiquement votre `netlify.toml` !

### Étape 4.3 : Configurer les variables d'environnement

1. Dans Netlify, allez dans **Site settings**
2. Allez dans **Build & deploy** → **Environment**
3. Cliquez sur **"Edit variables"**
4. Ajoutez :
   ```
   VITE_SUPABASE_URL = https://xxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiI...
   VITE_API_URL = https://xxxxxxxxxxx.supabase.co/functions/v1
   ```
5. Cliquez sur **"Save"**

### Étape 4.4 : Redéployer

1. Dans **Deploys**, attendez le déploiement initial
2. Une fois terminé, cliquez sur le déploiement
3. Cliquez sur **"Redeploy site"** (pour utiliser les nouvelles variables)

⏳ Attendez 2-3 minutes

### Étape 4.5 : Tester le déploiement

1. Allez sur votre URL Netlify (ex: `https://premunia-crm.netlify.app`)
2. Testez toutes les fonctionnalités
3. Vérifiez que les leads s'enregistrent dans Supabase

---

## 🔒 PHASE 5 : Sécurité (5 minutes)

### ⚠️ TRÈS IMPORTANT : Supprimer la page de promotion admin

Cette page permet à n'importe qui de devenir administrateur !

1. Supprimez le fichier :
   ```bash
   rm src/app/pages/PromoteAdmin.tsx
   ```

2. Modifiez `src/app/routes.ts` :
   - Trouvez la ligne : `import PromoteAdmin from "./pages/PromoteAdmin";`
   - Supprimez-la
   - Trouvez le bloc de route `/promote-admin`
   - Supprimez-le complètement

3. Committez et poussez :
   ```bash
   git add -A
   git commit -m "Remove promote-admin page for security"
   git push origin main
   ```

4. Netlify redéploiera automatiquement ✅

---

## 📧 PHASE 6 : Configuration Email (10 minutes)

### Option A : Gmail (Facile)

1. Allez sur https://myaccount.google.com/security
2. Activez **"2-Step Verification"**
3. Créez un **"App Password"**
4. Dans votre CRM (/admin/automation), remplissez :
   ```
   Serveur: smtp.gmail.com
   Port: 587
   Utilisateur: votreemail@gmail.com
   Mot de passe: [votre-app-password]
   Email expéditeur: votreemail@gmail.com
   Nom expéditeur: Premunia
   ```

### Option B : SendGrid (Recommandé pour production)

1. Allez sur https://sendgrid.com/free
2. Créez un compte gratuit
3. Allez dans **Settings** → **API Keys**
4. Créez une clé API
5. Dans votre CRM (/admin/automation), remplissez :
   ```
   Serveur: smtp.sendgrid.net
   Port: 587
   Utilisateur: apikey
   Mot de passe: SG.xxxxx...
   Email expéditeur: notifications@votredomaine.fr
   Nom expéditeur: Premunia
   ```

---

## ✅ Checklist finale

Avant de mettre en production :

- [ ] ✅ Base de données Supabase créée et initialisée
- [ ] ✅ Variables d'environnement configurées (locale et Netlify)
- [ ] ✅ Déploiement Netlify fonctionne
- [ ] ✅ Les leads s'enregistrent correctement
- [ ] ✅ Connexion/Inscription fonctionne
- [ ] ✅ Admin dashboard accessible
- [ ] ✅ Page de promotion admin SUPPRIMÉE
- [ ] ✅ SMTP configuré
- [ ] ✅ Tests complets effectués

---

## 🎉 Vous êtes prêt !

Votre CRM Premunia est maintenant :
- ✅ Complètement configuré
- ✅ Sécurisé
- ✅ Déployé sur Netlify
- ✅ Connecté à Supabase

### Prochaines étapes

1. Invitez votre équipe sur Netlify
2. Configurez votre domaine personnalisé
3. Mettre en place les alertes de sécurité
4. Former votre équipe au CRM

---

## 📚 Documentation complète

| Document | Description |
|----------|-------------|
| `README_ARCHITECTURE.md` | Architecture technique détaillée |
| `DEPLOYMENT_NETLIFY.md` | Guide de déploiement Netlify complet |
| `QUICKSTART.md` | Guide 5 minutes pour démarrer |
| `GUIDE_PREMUNIA.md` | Guide utilisateur du CRM |

---

## 🆘 Besoin d'aide ?

- **Erreur de build** : Vérifiez les logs Netlify
- **Erreur de connexion Supabase** : Vérifiez vos clés d'environnement
- **Base de données non créée** : Réexécutez le script SQL dans Supabase
- **Les variables ne s'appliquent pas** : Redéployez après les avoir ajoutées

---

**Développé avec ❤️ pour Premunia** 🚀
