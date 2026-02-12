# 🎯 Guide de Configuration Premunia CRM

Bienvenue dans votre système CRM Premunia ! Ce guide vous accompagne pas à pas dans la configuration de votre plateforme.

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Première configuration](#première-configuration)
3. [Configuration SMTP](#configuration-smtp)
4. [Gestion des leads](#gestion-des-leads)
5. [Personnalisation du site](#personnalisation-du-site)
6. [Sécurité](#sécurité)

---

## 🌟 Vue d'ensemble

Votre plateforme Premunia comprend :

### Pages Publiques
- **Landing Page** (`/`) : Page d'accueil avec formulaire de contact
- **Connexion** (`/signin`) : Authentification des utilisateurs
- **Inscription** (`/signup`) : Création de compte

### Pages Admin (Protégées)
- **Dashboard** (`/admin`) : Vue d'ensemble et statistiques
- **Gestion des Leads** (`/admin/leads`) : CRUD complet des prospects
- **Paramètres** (`/admin/settings`) : Configuration des textes du site
- **Automatisation** (`/admin/automation`) : Configuration SMTP et emails

---

## 🚀 Première configuration

### Étape 1 : Créer votre compte administrateur

1. Allez sur `/signup`
2. Remplissez le formulaire :
   - Nom complet
   - Email
   - Mot de passe (minimum 6 caractères)
3. Cliquez sur "Créer mon compte"

### Étape 2 : Devenir administrateur

Après l'inscription, vous serez redirigé vers `/promote-admin`

1. Cliquez sur "Me promouvoir en Admin"
2. Vous serez redirigé vers le dashboard admin

### ⚠️ Étape 3 : SÉCURITÉ - Supprimer la page de promotion

**IMPORTANT** : Pour des raisons de sécurité, supprimez immédiatement le fichier :
```
/src/app/pages/PromoteAdmin.tsx
```

Et supprimez la route correspondante dans `/src/app/routes.ts` :
```typescript
// Supprimez ces lignes :
import PromoteAdmin from "./pages/PromoteAdmin";
{
  path: "/promote-admin",
  Component: PromoteAdmin,
},
```

---

## 📧 Configuration SMTP

Pour que les emails automatiques fonctionnent, configurez votre serveur SMTP :

### Accéder à la configuration
1. Connectez-vous à `/admin`
2. Cliquez sur "Automatisation"
3. Remplissez le formulaire SMTP

### Exemples de configuration

#### Gmail
```
Serveur : smtp.gmail.com
Port : 587
Utilisateur : votre@gmail.com
Mot de passe : [Mot de passe d'application]
Email expéditeur : votre@gmail.com
Nom expéditeur : Premunia
```

**Note Gmail** : Vous devez créer un "Mot de passe d'application" :
1. Allez sur https://myaccount.google.com/security
2. Activez la validation en 2 étapes
3. Créez un mot de passe d'application
4. Utilisez ce mot de passe dans la config SMTP

#### Outlook / Office 365
```
Serveur : smtp.office365.com
Port : 587
Utilisateur : votre@outlook.com
Mot de passe : [Votre mot de passe]
Email expéditeur : votre@outlook.com
Nom expéditeur : Premunia
```

#### SendGrid
```
Serveur : smtp.sendgrid.net
Port : 587
Utilisateur : apikey
Mot de passe : [Votre clé API SendGrid]
Email expéditeur : votre@domaine.com
Nom expéditeur : Premunia
```

---

## 👥 Gestion des leads

### Voir tous les leads

1. Allez sur `/admin/leads`
2. Vous verrez un tableau avec :
   - Nom et prénom
   - Email et téléphone
   - Profession
   - Statut
   - Date de création

### Rechercher un lead

Utilisez la barre de recherche en haut pour filtrer par :
- Nom
- Email
- Profession

### Modifier un lead

1. Cliquez sur l'icône ✏️ (Edit)
2. Modifiez le statut :
   - **Nouveau** : Lead non traité
   - **Contacté** : Lead contacté
   - **Converti** : Lead transformé en client
   - **Rejeté** : Lead non qualifié
3. Ajoutez des notes
4. Cliquez sur "Enregistrer"

### Supprimer un lead

1. Cliquez sur l'icône 🗑️ (Trash)
2. Confirmez la suppression

---

## 🎨 Personnalisation du site

### Modifier les textes

1. Allez sur `/admin/settings`
2. Modifiez les champs :
   - **Titre principal** : Le grand titre de la page d'accueil
   - **Sous-titre** : Le texte sous le titre
   - **Email de contact** : Affiché dans le footer
   - **Téléphone** : Affiché dans le footer
   - **Adresse** : Affichée dans le footer
3. Cliquez sur "Enregistrer"

Les modifications apparaîtront immédiatement sur la landing page.

---

## 🔒 Sécurité

### Bonnes pratiques

1. **Supprimez la page PromoteAdmin** après la première utilisation
2. **Utilisez un mot de passe fort** (minimum 12 caractères)
3. **Ne partagez jamais** vos identifiants
4. **Vérifiez régulièrement** les leads et supprimez ceux qui sont obsolètes
5. **Gardez votre configuration SMTP privée** - ne la partagez pas

### Déconnexion

Pour vous déconnecter, cliquez sur le bouton "Déconnexion" en haut à droite de toute page admin.

---

## 🎨 Charte Graphique Premunia

### Couleurs principales
- **Rouge Premunia** : `#EE3B33`
- **Orange** : `#F79E1B`
- **Magenta** : `#E91E63`
- **Violet** : `#880E4F`

Ces couleurs sont utilisées dans tout le site pour maintenir une identité visuelle cohérente.

---

## 📊 Fonctionnalités disponibles

✅ Landing page responsive avec formulaire de contact
✅ Système d'authentification sécurisé
✅ Dashboard admin avec statistiques
✅ Gestion CRUD complète des leads
✅ Recherche et filtrage des leads
✅ Statuts personnalisables (Nouveau, Contacté, Converti, Rejeté)
✅ Notes sur chaque lead
✅ Configuration SMTP pour emails automatiques
✅ Personnalisation des textes du site
✅ Design moderne et professionnel

---

## 🚀 Fonctionnalités futures suggérées

Voici des améliorations que vous pourriez demander :

1. **Templates d'emails personnalisables**
   - Créer plusieurs modèles d'emails
   - Variables dynamiques (nom, profession, etc.)

2. **Workflows d'automatisation**
   - Email automatique à l'enregistrement d'un lead
   - Relances automatiques après X jours
   - Notifications par email pour les admins

3. **Statistiques avancées**
   - Graphiques de conversion
   - Analyse par profession
   - Export Excel/CSV

4. **Gestion d'équipe**
   - Création d'utilisateurs multiples
   - Rôles (Admin / Commercial / Lecteur)
   - Assignation de leads aux utilisateurs

5. **Historique d'activité**
   - Logs de toutes les actions
   - Historique des modifications sur chaque lead

---

## 📞 Support

Si vous rencontrez des problèmes ou avez des questions, n'hésitez pas à demander de l'aide !

---

**Bonne utilisation de votre CRM Premunia ! 🎉**
