# ✅ Netlify Deployment Checklist

Suivez cette checklist pour un déploiement sûr et complet sur Netlify.

---

## 🔍 Pré-déploiement (Avant de pousser le code)

### Code
- [ ] ✅ Tous les changements sont commitées
- [ ] ✅ Le code a été testé localement avec `npm run dev`
- [ ] ✅ Pas d'erreurs console ou warnings importants
- [ ] ✅ Fichiers `.env.local` et `.env.*.local` dans `.gitignore`
- [ ] ✅ Pas de secrets ou clés d'API dans le code source

### Configuration
- [ ] ✅ `netlify.toml` est présent et correct
- [ ] ✅ `scripts/01-init-supabase.sql` est présent
- [ ] ✅ `package.json` contient tous les dépendances
- [ ] ✅ `tsconfig.json` est correct
- [ ] ✅ `.env.example` contient le bon template

### Sécurité
- [ ] ✅ `src/app/pages/PromoteAdmin.tsx` EST SUPPRIMÉ
- [ ] ✅ Route `/promote-admin` est SUPPRIMÉE de `routes.ts`
- [ ] ✅ Pas de debug logs en production
- [ ] ✅ Pas de tokens ou credentials dans le code

---

## 🗄️ Supabase Setup (Avant GitHub)

### Création du projet
- [ ] ✅ Compte Supabase créé sur https://supabase.com
- [ ] ✅ Nouveau projet créé
- [ ] ✅ Email confirmé
- [ ] ✅ Mot de passe fort généré

### Configuration
- [ ] ✅ Script SQL exécuté dans SQL Editor
- [ ] ✅ Toutes les 7 tables créées:
  - [ ] `leads`
  - [ ] `app_settings`
  - [ ] `user_roles`
  - [ ] `smtp_config`
  - [ ] `audit_logs`
  - [ ] `email_history`
  - [ ] `lead_activities`
- [ ] ✅ RLS policies créées
- [ ] ✅ Données par défaut insérées

### Clés de sécurité
- [ ] ✅ Project URL copié: `https://xxxxx.supabase.co`
- [ ] ✅ Anon Key copié (clé publique)
- [ ] ✅ Service Role Key stocké de manière sécurisée
- [ ] ✅ API Keys visibles dans Settings > API

---

## 🌐 GitHub Setup

### Repo
- [ ] ✅ Code poussé vers `https://github.com/investassur/Crerunelandingpage`
- [ ] ✅ Branch `main` est à jour
- [ ] ✅ Tous les fichiers sont visibles sur GitHub
- [ ] ✅ `.env.local` n'est PAS dans le repo (dans `.gitignore`)

### Fichiers de config
- [ ] ✅ `netlify.toml` visible sur GitHub
- [ ] ✅ `scripts/01-init-supabase.sql` visible
- [ ] ✅ `.env.example` visible
- [ ] ✅ `README_SETUP.md` visible
- [ ] ✅ `DEPLOYMENT_NETLIFY.md` visible
- [ ] ✅ `SETUP_COMPLETE.md` visible
- [ ] ✅ `DATABASE_SCHEMA.md` visible

---

## 🚀 Netlify Deploy Setup

### Compte Netlify
- [ ] ✅ Compte créé sur https://netlify.com
- [ ] ✅ Email confirmé
- [ ] ✅ Authentification GitHub configurée

### Site Creation
- [ ] ✅ "Add new site" > "Import an existing project"
- [ ] ✅ GitHub autorisé
- [ ] ✅ Repo `investassur/Crerunelandingpage` sélectionné
- [ ] ✅ Branch `main` sélectionné
- [ ] ✅ Build command: `npm run build`
- [ ] ✅ Publish directory: `dist`

### Vérification de build
- [ ] ✅ Premier build lancé avec succès
- [ ] ✅ Pas d'erreurs dans les logs Netlify
- [ ] ✅ Site URL généré (ex: `https://xxx.netlify.app`)

---

## 🔐 Environment Variables

### Configuration dans Netlify UI

1. **Site settings** > **Build & deploy** > **Environment**

- [ ] ✅ Cliquer sur "Edit variables"
- [ ] ✅ Ajouter variables de production:

| Clé | Valeur |
|-----|--------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | (votre clé anon) |
| `VITE_API_URL` | `https://xxxxx.supabase.co/functions/v1` |

- [ ] ✅ Cliquer "Save"
- [ ] ✅ Attendre 2-3 minutes

### Vérification
- [ ] ✅ Variables visibles dans le dashboard
- [ ] ✅ Format correct (pas de guillemets supplémentaires)
- [ ] ✅ Aucun espace avant/après les valeurs

---

## 🔄 Redéploiement

### Après ajout des variables
- [ ] ✅ Aller à **Deploys**
- [ ] ✅ Cliquer sur le premier déploiement
- [ ] ✅ Cliquer sur **"Redeploy site"**
- [ ] ✅ Attendre que le redéploiement soit terminé (5-10 min)

### Build Logs
- [ ] ✅ Vérifier les logs: 0 erreurs
- [ ] ✅ Le build se termine avec "All done ✓"
- [ ] ✅ Artifacts téléchargés correctement

---

## 🧪 Tests en Production

### Landing Page
- [ ] ✅ Allez sur votre URL Netlify
- [ ] ✅ La page charge correctement
- [ ] ✅ Les images s'affichent
- [ ] ✅ Le design est correct
- [ ] ✅ Aucune erreur console (F12)

### Formulaire de lead
- [ ] ✅ Remplissez et soumettez le formulaire
- [ ] ✅ Message de succès affiché
- [ ] ✅ Vérifiez dans Supabase > `leads` que le lead est créé

### Authentification
- [ ] ✅ Allez sur `/signup` (ex: `https://xxx.netlify.app/signup`)
- [ ] ✅ Créez un compte avec email/password
- [ ] ✅ Vérifiez dans Supabase > Auth que l'utilisateur est créé
- [ ] ✅ Allez sur `/signin` et connectez-vous

### Dashboard Admin
- [ ] ✅ Allez sur `/admin`
- [ ] ✅ Vous êtes redirigé vers `/promote-admin` (Normal - première fois)
- [ ] ✅ Cliquez sur "Me promouvoir en Admin"
- [ ] ✅ Vous êtes redirigé vers `/admin`
- [ ] ✅ Dashboard affiche les leads

### Lead Management
- [ ] ✅ Allez sur `/admin/leads`
- [ ] ✅ Vous voyez le lead que vous avez créé
- [ ] ✅ Cliquez sur l'icône d'édition
- [ ] ✅ Changez le statut et modifiez les notes
- [ ] ✅ Cliquez "Enregistrer"
- [ ] ✅ Les changements sont sauvegardés

### Settings
- [ ] ✅ Allez sur `/admin/settings`
- [ ] ✅ Modifiez le titre principal
- [ ] ✅ Cliquez "Enregistrer"
- [ ] ✅ Allez à `/` et vérifiez le changement

### Automation (SMTP)
- [ ] ✅ Allez sur `/admin/automation`
- [ ] ✅ Entrez votre config SMTP (Gmail ou SendGrid)
- [ ] ✅ Cliquez "Enregistrer"
- [ ] ✅ Les paramètres sont sauvegardés

---

## 🔒 Sécurité Post-déploiement

### Code
- [ ] ✅ Vérifiez encore que `/promote-admin` n'existe plus
- [ ] ✅ Essayez d'accéder à `/promote-admin` → Doit rediriger
- [ ] ✅ Pas d'erreur 404, juste une redirection

### Supabase
- [ ] ✅ RLS policies actives sur toutes les tables
- [ ] ✅ Public ne peut CRÉER les leads (table `leads`)
- [ ] ✅ Public ne peut PAS lire les leads
- [ ] ✅ Seuls les authentifiés peuvent lire/modifier

### Netlify
- [ ] ✅ Headers de sécurité configurés (dans netlify.toml)
- [ ] ✅ CORS configuré correctement
- [ ] ✅ Pas de secrets exposés dans les variables

---

## 📊 Performance & Monitoring

### Netlify Analytics
- [ ] ✅ Analytics activé dans Netlify (optionnel)
- [ ] ✅ Vérifier le page load time

### Supabase Monitoring
- [ ] ✅ Allez dans Supabase > Reports
- [ ] ✅ Vérifier les requêtes d'API
- [ ] ✅ Aucune erreur d'authentification

### Browser Console
- [ ] ✅ Ouvrir DevTools (F12)
- [ ] ✅ Console: 0 erreurs
- [ ] ✅ Network: Tous les requêtes réussissent (200/201)

---

## 🎯 Post-déploiement

### Configuration supplémentaire
- [ ] ✅ Domaine personnalisé configuré (optionnel)
  - Allez dans Netlify > Domain settings
  - Configurez votre domaine
  - Attendez la propagation DNS (24-48h)

- [ ] ✅ HTTPS automatique (inclus avec Netlify)

- [ ] ✅ Build notifications configurées (optionnel)
  - Allez dans Netlify > Site settings > Build & deploy > Notifications

### Documentation
- [ ] ✅ Documentation mise à jour si nécessaire
- [ ] ✅ Guide utilisateur prêt pour l'équipe
- [ ] ✅ Instructions de backup créées

### Backup & Maintenance
- [ ] ✅ Supabase backup configuré
- [ ] ✅ Export des leads documenté
- [ ] ✅ Processus de maintenance documenté

---

## 🚨 Troubleshooting rapide

### Le site ne charge pas
```
1. Vérifier que Netlify a fini le build (Deploys page)
2. Vérifier les logs de build pour erreurs
3. Vérifier que les variables d'env sont définies
4. Redéployer manuellement
```

### Erreur "Cannot find supabase"
```
1. Vérifier VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
2. Redéployer après avoir ajouté les variables
3. Vérifier dans DevTools > Network > Fetch/XHR
```

### Les leads ne s'enregistrent pas
```
1. Ouvrir DevTools > Console
2. Vérifier les erreurs
3. Vérifier que la table leads existe dans Supabase
4. Vérifier les RLS policies
```

### Authentification échoue
```
1. Vérifier que auth.users existe dans Supabase
2. Vérifier que l'utilisateur est créé dans Supabase Auth
3. Vérifier le SUPABASE_URL
4. Vérifier SUPABASE_ANON_KEY
```

---

## ✅ Déploiement complet !

Une fois toutes les cases cochées, votre CRM Premunia est :

✅ Prêt en production
✅ Sécurisé
✅ Performant
✅ Scalable

---

## 📞 Support

- **Problème de build** : Consultez les logs Netlify
- **Problème de DB** : Consultez Supabase Logs
- **Questions** : Voir `README_SETUP.md` et `DATABASE_SCHEMA.md`

---

**Déploiement réussi ! 🎉**
