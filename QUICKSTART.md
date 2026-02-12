# ⚡ Démarrage Rapide - Premunia CRM

Bienvenue ! Voici un guide ultra-rapide pour commencer à utiliser votre CRM Premunia en 5 minutes.

---

## ✅ Ce qui a été créé pour vous

### 🎨 Landing Page Complète
- **URL** : `/` (page d'accueil)
- Formulaire de contact fonctionnel
- Design moderne avec la charte Premunia
- Graphique de simulation fiscale
- Sections: Avantages, Cibles, Contact

### 🔐 Système d'Authentification
- **Inscription** : `/signup`
- **Connexion** : `/signin`
- Protection automatique des pages admin

### 📊 Dashboard Admin
- **URL** : `/admin`
- Statistiques en temps réel
- Vue d'ensemble des leads
- Accès rapide à toutes les fonctions

### 👥 Gestion des Leads
- **URL** : `/admin/leads`
- Liste complète + recherche
- Modification de statut et notes
- Suppression sécurisée

### ⚙️ Configuration
- **Paramètres** : `/admin/settings` (textes du site)
- **Automatisation** : `/admin/automation` (SMTP)

---

## 🚀 4 Étapes pour Commencer

### Étape 1️⃣ : Créer votre compte admin (2 min)

1. Allez sur `/signup`
2. Remplissez :
   - **Nom** : Votre nom complet
   - **Email** : votre@email.com
   - **Mot de passe** : Min 6 caractères
3. Cliquez sur **"Créer mon compte"**

✅ Vous êtes automatiquement connecté et redirigé vers la page de promotion.

---

### Étape 2️⃣ : Vous promouvoir en administrateur (30 sec)

1. Vous êtes sur `/promote-admin`
2. Cliquez sur **"Me promouvoir en Admin"**
3. Vous êtes redirigé vers le dashboard admin

✅ Vous avez maintenant un accès complet au CRM !

---

### Étape 3️⃣ : ⚠️ SÉCURITÉ - Supprimer la page de promotion (1 min)

**TRÈS IMPORTANT** : Cette page permet à n'importe qui de devenir admin. Supprimez-la immédiatement !

#### Comment supprimer :

1. **Supprimez le fichier** : `/src/app/pages/PromoteAdmin.tsx`

2. **Modifiez le fichier** `/src/app/routes.ts` :
   - Supprimez la ligne : `import PromoteAdmin from "./pages/PromoteAdmin";`
   - Supprimez ce bloc :
     ```typescript
     {
       path: "/promote-admin",
       Component: PromoteAdmin,
     },
     ```

✅ Votre CRM est maintenant sécurisé !

---

### Étape 4️⃣ : Configurer SMTP (Optionnel - 3 min)

Pour recevoir des emails automatiques quand un lead s'inscrit :

1. Allez sur `/admin/automation`
2. Remplissez votre configuration SMTP

#### Exemple Gmail :
```
Serveur    : smtp.gmail.com
Port       : 587
Utilisateur: votre@gmail.com
Mot de passe: [Créez un mot de passe d'application]
Email expéditeur: votre@gmail.com
Nom expéditeur: Premunia
```

**Note** : Pour Gmail, vous devez créer un "mot de passe d'application" :
- https://myaccount.google.com/security
- Activez la validation en 2 étapes
- Créez un mot de passe d'application
- Utilisez ce mot de passe (pas votre mot de passe principal)

#### Exemple Outlook :
```
Serveur    : smtp.office365.com
Port       : 587
Utilisateur: votre@outlook.com
Mot de passe: [Votre mot de passe Outlook]
Email expéditeur: votre@outlook.com
Nom expéditeur: Premunia
```

3. Cliquez sur **"Enregistrer"**

✅ Les emails automatiques sont configurés !

---

## 🎯 Comment Utiliser le CRM

### Recevoir des Leads

1. Les visiteurs remplissent le formulaire sur `/`
2. Les leads apparaissent automatiquement dans `/admin/leads`
3. Statut par défaut : **"Nouveau"**

### Gérer les Leads

1. Allez sur `/admin/leads`
2. Pour **modifier** un lead :
   - Cliquez sur l'icône ✏️
   - Changez le statut : Nouveau → Contacté → Converti
   - Ajoutez des notes
   - Cliquez sur "Enregistrer"
3. Pour **supprimer** un lead :
   - Cliquez sur l'icône 🗑️
   - Confirmez

### Rechercher des Leads

- Utilisez la barre de recherche en haut
- Recherche par : nom, email, profession

### Personnaliser le Site

1. Allez sur `/admin/settings`
2. Modifiez :
   - Titre de la page d'accueil
   - Sous-titre
   - Email/Téléphone/Adresse de contact
3. Cliquez sur "Enregistrer"
4. Les changements sont **visibles immédiatement** sur `/`

---

## 📊 Dashboard - Ce que Vous Voyez

- **Total Leads** : Nombre total de prospects
- **Nouveaux Leads** : Leads avec statut "Nouveau"
- **Taux de nouveaux** : % de leads non encore traités

**Derniers leads** : Tableau des 5 derniers prospects enregistrés

---

## 🎨 Charte Graphique Premunia

Votre site utilise automatiquement les couleurs de Premunia :

- **Rouge Premunia** : `#EE3B33` (Boutons principaux, CTAs)
- **Orange** : `#F79E1B` (Accents, badges)
- **Violet** : `#880E4F` (Sections sombres, hover)
- **Magenta** : `#E91E63` (Accents secondaires)

Vous n'avez rien à faire - c'est déjà configuré ! ✅

---

## 🔐 Se Déconnecter

Cliquez sur le bouton **"Déconnexion"** en haut à droite de n'importe quelle page admin.

---

## 🆘 Problèmes Fréquents

### Je ne peux pas me connecter
- Vérifiez votre email/mot de passe
- Le mot de passe doit faire minimum 6 caractères

### Je ne vois pas mes leads
- Vérifiez que vous êtes bien connecté
- Allez sur `/admin/leads` (pas `/admin`)

### La config SMTP ne fonctionne pas
- Vérifiez le serveur et le port
- Pour Gmail, utilisez un mot de passe d'application
- Testez d'abord avec un autre service (SendGrid, Mailgun)

### Page "/promote-admin" encore accessible
- Vous avez oublié de supprimer le fichier
- Supprimez `/src/app/pages/PromoteAdmin.tsx`
- Retirez la route dans `/src/app/routes.ts`

---

## 📚 Documentation Complète

- **[README.md](./README.md)** : Vue d'ensemble du projet
- **[GUIDE_PREMUNIA.md](./GUIDE_PREMUNIA.md)** : Guide complet
- **[README_ARCHITECTURE.md](./README_ARCHITECTURE.md)** : Architecture technique

---

## 🎉 C'est Terminé !

Vous êtes prêt à utiliser votre CRM Premunia ! 

### Prochaines étapes :

1. ✅ Testez le formulaire sur `/` 
2. ✅ Vérifiez que le lead apparaît dans `/admin/leads`
3. ✅ Personnalisez les textes dans `/admin/settings`
4. ✅ Configurez SMTP dans `/admin/automation`

**Bon travail avec Premunia ! 🚀**

---

💡 **Astuce** : Ajoutez `/signin` à vos favoris pour un accès rapide au CRM.
