# ⚡ Quick Commands Reference

Tous les commandes essentielles pour installer et déployer Premunia CRM.

---

## 🚀 Installation Locale (3 commandes)

### 1. Cloner et installer
```bash
git clone https://github.com/investassur/Crerunelandingpage.git
cd Crerunelandingpage
npm install
```

### 2. Configurer les variables
```bash
cp .env.example .env.local
# Puis éditer .env.local avec vos clés Supabase
```

### 3. Lancer le serveur
```bash
npm run dev
# Ouvre http://localhost:5173
```

---

## 🗄️ Supabase Setup

### Créer la base de données
1. Aller dans Supabase SQL Editor
2. Créer une nouvelle query
3. Copier-coller le contenu de `scripts/01-init-supabase.sql`
4. Cliquer "Run"

### Via CLI (optionnel)
```bash
# Installer Supabase CLI
npm install -g supabase

# Se connecter
supabase login

# Lier le projet
supabase link

# Pousser les migrations
supabase db push scripts/01-init-supabase.sql
```

---

## ✅ Vérification

```bash
# Vérifier que tout est configuré
chmod +x scripts/verify-setup.sh
./scripts/verify-setup.sh
```

---

## 🔨 Build Production

```bash
# Builder pour production
npm run build

# Prévisualiser le build
npm run preview
```

---

## 📤 Déploiement GitHub

```bash
# Ajouter les fichiers
git add netlify.toml
git add .env.example
git add scripts/01-init-supabase.sql
git add README_SETUP.md
git add SETUP_COMPLETE.md
git add DEPLOYMENT_NETLIFY.md
git add DATABASE_SCHEMA.md
git add NETLIFY_CHECKLIST.md

# Committer
git commit -m "Add Supabase and Netlify configuration"

# Pousser
git push origin main
```

---

## 🌐 Netlify Deployment

### Via CLI
```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Déployer
netlify deploy --prod

# Ou build puis deploy
npm run build
netlify deploy --prod --dir=dist
```

### Via Web UI
1. Aller sur https://netlify.com
2. Cliquer "Add new site"
3. Sélectionner "Import an existing project"
4. Autoriser GitHub
5. Sélectionner le repo

---

## 🔐 Sécurité Post-Déploiement

```bash
# Supprimer la page de promotion admin
rm src/app/pages/PromoteAdmin.tsx

# Modifier les routes
# (Ouvrir src/app/routes.ts et supprimer:)
# - import PromoteAdmin from "./pages/PromoteAdmin";
# - Le bloc de route /promote-admin

# Pousser les changements
git add -A
git commit -m "Remove promote-admin page for security"
git push origin main

# Netlify redéploiera automatiquement
```

---

## 📧 Configuration Email

### Via UI du CRM
1. Aller sur `/admin/automation`
2. Entrer configuration SMTP
3. Cliquer "Enregistrer"

### Exemples

**Gmail**:
```
Serveur: smtp.gmail.com
Port: 587
Utilisateur: votre@gmail.com
Mot de passe: [app-password]
Email expéditeur: votre@gmail.com
Nom expéditeur: Premunia
```

**SendGrid**:
```
Serveur: smtp.sendgrid.net
Port: 587
Utilisateur: apikey
Mot de passe: SG.xxxxx
Email expéditeur: notifications@premunia.fr
Nom expéditeur: Premunia
```

---

## 🧪 Tests

### Test local
```bash
npm run dev
# Puis naviguer vers:
# - / (landing page)
# - /signup (inscription)
# - /signin (connexion)
# - /admin (dashboard)
```

### Test production
```bash
# Remplacer par votre URL Netlify
https://your-site.netlify.app/
https://your-site.netlify.app/signup
https://your-site.netlify.app/signin
https://your-site.netlify.app/admin
```

---

## 🧹 Maintenance

### Exporter les données
```bash
# Via Supabase CLI
supabase db dump -f backup.sql

# Via PostgreSQL
pg_dump -h YOUR_HOST.supabase.co \
  -U postgres \
  -d postgres > backup.sql
```

### Restaurer les données
```bash
psql -h YOUR_HOST.supabase.co -U postgres -d postgres < backup.sql
```

### Voir les logs
```bash
# Netlify
netlify logs --tail

# Supabase
supabase functions logs make-server-07afcff5
```

---

## 🐛 Debugging

### Vérifier les variables d'env
```bash
# Localement
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# En production (Netlify Dashboard)
# Site settings → Build & deploy → Environment
```

### Voir les erreurs de build
```bash
# Localement
npm run build

# Netlify
# Allez dans Deploys > voir les logs
```

### Tester la connexion API
```bash
# Via curl
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://YOUR_PROJECT.supabase.co/functions/v1/make-server-07afcff5/health
```

---

## 📊 Supabase CLI Utiles

```bash
# Lister les projets
supabase projects list

# Voir l'URL du projet
supabase projects describe

# Voir les logs des functions
supabase functions logs

# Voir l'utilisation de la DB
supabase db usage

# Voir les backups
supabase projects backup-list
```

---

## 🔗 URLs Importantes

- **Local Dev**: `http://localhost:5173`
- **GitHub**: `https://github.com/investassur/Crerunelandingpage`
- **Netlify**: `https://netlify.com`
- **Supabase**: `https://supabase.com`
- **API Backend**: `https://YOUR_PROJECT.supabase.co/functions/v1`

---

## 📚 Documentation Complète

```bash
# Consulter
less README_SETUP.md              # Vue d'ensemble
less SETUP_COMPLETE.md            # Installation guidée
less DEPLOYMENT_NETLIFY.md        # Déploiement
less DATABASE_SCHEMA.md           # Schéma DB
less NETLIFY_CHECKLIST.md         # Checklist
less README_ARCHITECTURE.md       # Architecture
```

---

## 🆘 Problèmes Courants

### "npm install échoue"
```bash
# Effacer le cache
npm cache clean --force
rm -rf node_modules package-lock.json

# Réinstaller
npm install
```

### "Variables d'env non reconnues"
```bash
# Créer .env.local
cp .env.example .env.local

# Remplir les variables
# Puis redémarrer le serveur de dev
```

### "Build échoue"
```bash
# Vérifier localement
npm run build

# Voir les erreurs
npm run build 2>&1

# Vérifier tsconfig.json et package.json
```

### "Les leads ne s'enregistrent pas"
```bash
# Ouvrir DevTools (F12)
# Vérifier la Console pour erreurs
# Vérifier Network > Fetch/XHR

# Vérifier la DB existe
# Supabase > Table Editor > leads
```

---

## ✨ Pro Tips

1. **Utiliser Git Branches**
   ```bash
   git checkout -b feature/new-feature
   git push -u origin feature/new-feature
   ```

2. **Voir les changements Netlify en direct**
   ```bash
   netlify watch
   ```

3. **Avoir plusieurs branches déployées**
   ```bash
   # Branch deploy automatique sur Netlify
   git push origin staging
   ```

4. **Monitor les perf**
   - Netlify Analytics (dans Settings)
   - Supabase Logs (dans Reports)

---

## 📋 Checklist Déploiement

```bash
# Pré-deploy
git status                    # Vérifier pas de fichiers uncommitted
npm run build                 # Build localement
./scripts/verify-setup.sh     # Vérifier la config

# Deploy
git add -A
git commit -m "message"
git push origin main

# Post-deploy
# Attendre Netlify build (5-10 min)
# Tester en production
# Vérifier logs si erreur
```

---

## 🎯 Raccourcis Utiles

```bash
# Développement rapide
npm run dev                   # Serveur + hot reload

# Vérifier erreurs
npm run lint                  # Vérifier le code

# Formater le code
npm run format               # Formater

# Git shortcuts
git log --oneline            # Voir l'historique
git diff                     # Voir les changements
git status -sb               # Status court
```

---

## 📞 Besoin d'aide ?

- **Erreur locale**: Consulter `SETUP_COMPLETE.md`
- **Erreur de déploiement**: Consulter `DEPLOYMENT_NETLIFY.md`
- **Erreur de DB**: Consulter `DATABASE_SCHEMA.md`
- **Vérifier la config**: Utiliser `scripts/verify-setup.sh`

---

**Gardez ce fichier à portée de main ! 🎯**

*Tous les commandes essentielles en un seul endroit.* ⚡
