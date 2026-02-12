# 🚀 Guide de Déploiement - Premunia CRM sur Netlify

Ce guide vous explique comment déployer complètement votre CRM Premunia sur Netlify avec Supabase.

---

## 📋 Prérequis

- ✅ Compte GitHub (pour connecter le repo)
- ✅ Compte Netlify (gratuit sur https://netlify.com)
- ✅ Compte Supabase (gratuit sur https://supabase.com)
- ✅ Votre repo Git clonné avec les fichiers Premunia

---

## ⚙️ Étape 1 : Configurer Supabase

### 1.1 Créer un projet Supabase

1. Allez sur https://supabase.com
2. Cliquez sur **"New Project"**
3. Remplissez :
   - **Name** : `premunia-crm` (ou autre nom)
   - **Password** : Générez un mot de passe fort
   - **Region** : Sélectionnez la région la plus proche (ex: Europe - France)
4. Attendez la création (2-3 minutes)

### 1.2 Récupérer vos clés Supabase

1. Allez dans **Settings > API**
2. Copiez :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon Key** → `VITE_SUPABASE_ANON_KEY`
   - **Service Role Key** → À garder confidentiel (pour le backend seulement)

### 1.3 Initialiser la base de données

1. Ouvrez le **SQL Editor** de Supabase (dans le menu de gauche)
2. Cliquez sur **"New Query"**
3. Copiez-collez tout le contenu de `/scripts/01-init-supabase.sql`
4. Cliquez sur **"Run"**

✅ Votre base de données Supabase est prête !

---

## 🌐 Étape 2 : Configurer Netlify

### 2.1 Connecter votre repo GitHub

1. Allez sur https://netlify.com
2. Cliquez sur **"Add new site"** → **"Import an existing project"**
3. Sélectionnez **GitHub**
4. Autorisez Netlify à accéder à votre GitHub
5. Sélectionnez votre repo `investassur/Crerunelandingpage`
6. Cliquez sur **"Import"**

### 2.2 Configurer les paramètres de build

Netlify détectera automatiquement votre configuration `netlify.toml`, mais vérifiez :

1. **Build command** : `npm run build`
2. **Publish directory** : `dist`
3. Cliquez sur **"Deploy site"**

### 2.3 Ajouter les variables d'environnement

1. Allez dans **Site settings** → **Build & deploy** → **Environment**
2. Cliquez sur **"Edit variables"**
3. Ajoutez les variables :

```
VITE_SUPABASE_URL = https://votre-project.supabase.co
VITE_SUPABASE_ANON_KEY = votre-clé-anon
VITE_API_URL = https://votre-project.supabase.co/functions/v1
```

⚠️ **IMPORTANT** : N'ajoutez PAS votre clé Service Role ici ! Elle ne doit jamais être exposée.

4. Cliquez sur **"Save"**

### 2.4 Redéployer après les variables

1. Allez dans **Deploys**
2. Cliquez sur le dernier déploiement
3. Cliquez sur **"Redeploy site"**

Attendez 2-3 minutes pour que le site se redéploie avec les nouvelles variables.

---

## 🔧 Étape 3 : Configurer votre application frontend

### 3.1 Mettre à jour les variables d'environnement

Créez/modifiez le fichier `.env.local` à la racine du projet :

```bash
VITE_SUPABASE_URL=https://votre-project.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon
VITE_API_URL=https://votre-project.supabase.co/functions/v1
```

### 3.2 Mettre à jour le fichier de configuration Supabase

Modifiez `/utils/supabase/info.tsx` :

```typescript
export const projectId = "votre-project-id"; // Ex: "abcdef123456"
export const publicAnonKey = "votre-clé-anon";
```

### 3.3 Tester localement

```bash
npm run dev
```

Vérifiez que :
- ✅ La landing page s'affiche correctement
- ✅ Le formulaire de lead fonctionne
- ✅ La connexion/inscription fonctionne

---

## 📧 Étape 4 : Configuration SMTP (Email)

### 4.1 Créer un compte email

Options recommandées :

#### Gmail
1. Allez sur https://myaccount.google.com/security
2. Activez la **vérification en 2 étapes**
3. Créez un **mot de passe d'application**
4. Utilisez ce mot de passe dans la config SMTP

#### SendGrid (Recommandé pour la production)
1. Créez un compte sur https://sendgrid.com
2. Vérifiez votre domaine
3. Créez une clé API
4. Utilisez la clé dans la config SMTP

#### Mailgun
1. Créez un compte sur https://mailgun.com
2. Vérifiez votre domaine
3. Récupérez les informations SMTP

### 4.2 Configurer dans le CRM

1. Allez sur `/admin/automation`
2. Entrez vos informations :

**Exemple Gmail :**
```
Serveur: smtp.gmail.com
Port: 587
Utilisateur: votre@gmail.com
Mot de passe: votre-mot-de-passe-d-application
Email expéditeur: votre@gmail.com
Nom expéditeur: Premunia
```

**Exemple SendGrid :**
```
Serveur: smtp.sendgrid.net
Port: 587
Utilisateur: apikey
Mot de passe: SG.xxx...
Email expéditeur: notifications@premunia.fr
Nom expéditeur: Premunia
```

3. Cliquez sur **"Enregistrer"**

---

## 🔐 Étape 5 : Sécurité

### 5.1 Supprimer la page de promotion admin

⚠️ **TRÈS IMPORTANT** : N'oubliez pas cette étape !

1. Supprimez le fichier : `/src/app/pages/PromoteAdmin.tsx`
2. Modifiez `/src/app/routes.ts` :
   - Supprimez : `import PromoteAdmin from "./pages/PromoteAdmin";`
   - Supprimez la route `/promote-admin`

3. Committez et poussez les changements :
```bash
git add -A
git commit -m "Remove promote-admin page for security"
git push
```

Netlify détectera le changement et redéploiera automatiquement.

### 5.2 Configurer les variables de sécurité

Dans Netlify, configurez également :
- N'exposez JAMAIS votre `SUPABASE_SERVICE_ROLE_KEY`
- Utilisez des tokens JWT pour l'authentification
- Activez CORS sur votre domaine de production

---

## 📊 Étape 6 : Tester le déploiement

1. Allez sur votre URL Netlify (ex: `https://premunia-crm.netlify.app`)

2. Testez les fonctionnalités :

✅ **Landing page** : `/`
- Le formulaire de contact fonctionne
- Les leads sont créés

✅ **Inscription** : `/signup`
- Vous pouvez créer un compte
- Vous êtes redirigé vers la promotion admin

✅ **Admin** : `/admin`
- Vous pouvez vous connecter
- Vous voyez vos leads
- Vous pouvez gérer les paramètres et SMTP

✅ **Vérifier les données** : 
- Allez sur Supabase > SQL Editor
- Vérifiez que les données sont dans les tables

---

## 🆘 Troubleshooting

### Le site ne se déploie pas

**Cause possible** : Erreur de build

**Solution** :
1. Vérifiez les logs Netlify dans **Deploys**
2. Vérifiez les variables d'environnement
3. Testez localement avec `npm run build`

### Les variables d'environnement ne sont pas reconnues

**Solution** :
1. Vérifiez qu'elles sont nommées correctement avec `VITE_` au début
2. Redéployez le site après les avoir ajoutées
3. Vérifiez dans la console du navigateur (F12) que les variables sont visibles

### La connexion Supabase échoue

**Solution** :
1. Vérifiez votre `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
2. Vérifiez que votre projet Supabase est actif
3. Testez dans la console : `fetch('${URL}/rest/v1/')`

### Les leads ne s'enregistrent pas

**Solution** :
1. Vérifiez les logs Supabase (View logs)
2. Vérifiez que les tables existent (SQL Editor)
3. Vérifiez les RLS policies (Table > RLS)

---

## 🚀 Prochaines étapes

### Après le déploiement

1. ✅ Configurer votre domaine personnalisé (Netlify > Domain management)
2. ✅ Activer HTTPS automatique (inclus avec Netlify)
3. ✅ Configurer les notifications Slack (optionnel)
4. ✅ Mettre en place un monitoring (Netlify Analytics)

### Améliorations futures

- [ ] Ajouter des analytics (Plausible, Fathom)
- [ ] Configurer des webhooks pour les emails automatiques
- [ ] Intégrer Stripe pour les paiements
- [ ] Ajouter un système de notifications
- [ ] Multi-utilisateurs avec rôles granulaires

---

## 📞 Support

- **Netlify** : https://docs.netlify.com
- **Supabase** : https://supabase.com/docs
- **React Router** : https://reactrouter.com/docs

---

## ✨ Configuration complète

Votre architecture finale :

```
Frontend (Netlify)
    ↓
Vite Build (dist/)
    ↓
React Router (SPA)
    ↓
Supabase API
    ↓
PostgreSQL Database
```

**Tous les fichiers de configuration sont prêts !** 🎉

Pour plus de détails sur l'architecture technique, consultez `README_ARCHITECTURE.md`.
