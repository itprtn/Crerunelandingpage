# 🚀 Premunia CRM - Landing Page & Système de Gestion des Leads

Plateforme complète de génération et de gestion de leads pour Premunia, spécialiste PER (Plan Épargne Retraite) pour professions libérales.

---

## ✨ Fonctionnalités

### 🌐 Landing Page Publique
- Design moderne reprenant la charte graphique Premunia (Rouge #EE3B33, Orange #F79E1B)
- Formulaire de contact avec validation en temps réel
- Sections : Hero, Avantages, Cibles, Simulation fiscale, Contact
- Graphique interactif montrant l'économie d'impôt (Recharts)
- 100% responsive (mobile, tablette, desktop)

### 🔐 Système d'Authentification
- Inscription sécurisée via Supabase Auth
- Connexion avec email/mot de passe
- Protection des routes admin
- Gestion des sessions

### 📊 Dashboard Administrateur
- Vue d'ensemble avec statistiques en temps réel
- Compteurs : Total leads, Nouveaux leads, Taux de conversion
- Tableau des derniers prospects
- Accès rapide à toutes les fonctionnalités

### 👥 Gestion des Leads (CRUD Complet)
- **Create** : Formulaire public sur la landing page
- **Read** : Liste complète avec recherche et filtres
- **Update** : Modification du statut (Nouveau, Contacté, Converti, Rejeté) + Notes
- **Delete** : Suppression sécurisée

### ⚙️ Personnalisation du Site
- Interface pour modifier les textes de la landing page :
  - Titre principal (Hero)
  - Sous-titre
  - Email, téléphone, adresse de contact
- Modifications visibles en temps réel

### 📧 Configuration SMTP
- Interface de configuration pour votre serveur d'envoi d'emails
- Exemples pour Gmail, Outlook, SendGrid
- Préparé pour l'automatisation future (templates d'emails)

---

## 🛠️ Technologies Utilisées

### Frontend
- **React 18.3.1** avec TypeScript
- **React Router 7** (Data mode) pour la navigation
- **TanStack React Query** pour la gestion des données
- **Tailwind CSS v4** pour le styling
- **Recharts** pour les graphiques
- **Lucide React** pour les icônes
- **Sonner** pour les notifications

### Backend
- **Supabase** (PostgreSQL + Auth + Edge Functions)
- **Hono** (framework web pour Deno)
- **KV Store** pour le stockage des données

---

## 📋 Pages Disponibles

| Route | Description | Protection |
|-------|-------------|------------|
| `/` | Landing page publique | Public |
| `/signin` | Connexion | Public |
| `/signup` | Inscription | Public |
| `/promote-admin` | Promotion admin (temporaire) | Auth |
| `/admin` | Dashboard principal | Auth |
| `/admin/leads` | Gestion des leads | Auth |
| `/admin/settings` | Paramètres du site | Auth |
| `/admin/automation` | Config SMTP | Auth |

---

## 🚀 Démarrage Rapide

### 1. Créer un compte admin

1. Allez sur `/signup`
2. Créez votre compte
3. Vous serez redirigé vers `/promote-admin`
4. Cliquez sur "Me promouvoir en Admin"

### 2. ⚠️ SÉCURITÉ : Supprimer la page de promotion

**IMPORTANT** : Après votre première connexion, supprimez le fichier :
```
/src/app/pages/PromoteAdmin.tsx
```

Et retirez la route dans `/src/app/routes.ts`

### 3. Configurer le SMTP (Optionnel)

1. Allez sur `/admin/automation`
2. Remplissez votre configuration SMTP
3. Enregistrez

Exemples :
- **Gmail** : `smtp.gmail.com:587` (nécessite un mot de passe d'application)
- **Outlook** : `smtp.office365.com:587`

### 4. Personnaliser le site

1. Allez sur `/admin/settings`
2. Modifiez les textes
3. Enregistrez - les changements sont immédiats

---

## 📚 Documentation Complète

- **[GUIDE_PREMUNIA.md](./GUIDE_PREMUNIA.md)** : Guide utilisateur complet
- **[README_ARCHITECTURE.md](./README_ARCHITECTURE.md)** : Architecture technique détaillée

---

## 🎨 Charte Graphique Premunia

```css
Rouge Premunia : #EE3B33
Orange        : #F79E1B
Magenta       : #E91E63
Violet        : #880E4F
```

Ces couleurs sont utilisées de manière cohérente dans tout le site pour maintenir l'identité visuelle de Premunia.

---

## 📊 Structure des Données

### Lead
```typescript
{
  id: string,
  first_name: string,
  last_name: string,
  email: string,
  phone: string,
  profession: string,
  message?: string,
  status: 'new' | 'contacted' | 'converted' | 'rejected',
  notes?: string,
  created_at: string,
  updated_at: string
}
```

### Settings
```typescript
{
  hero_title: string,
  hero_subtitle: string,
  contact_email: string,
  contact_phone: string,
  contact_address: string
}
```

---

## 🔐 Sécurité

- ✅ Authentification via Supabase Auth (tokens JWT)
- ✅ Protection des routes admin (frontend + backend)
- ✅ Vérification des permissions sur chaque appel API
- ✅ Mot de passe SMTP chiffré côté backend
- ✅ CORS configuré pour sécurité maximale

---

## 🚀 Améliorations Futures Suggérées

### Niveau 1 (Facile)
- [ ] Export CSV des leads
- [ ] Filtres avancés par date
- [ ] Pagination pour grandes listes
- [ ] Tri des colonnes

### Niveau 2 (Moyen)
- [ ] Templates d'emails personnalisables
- [ ] Envoi d'emails manuels depuis l'interface
- [ ] Pièces jointes sur les leads
- [ ] Statistiques avancées avec graphiques

### Niveau 3 (Avancé)
- [ ] Workflows d'automatisation multi-étapes
- [ ] Multi-utilisateurs avec rôles granulaires
- [ ] Intégration calendrier (prise de RDV)
- [ ] Historique complet des actions
- [ ] Notifications push
- [ ] API REST publique

---

## 📞 Support

Consultez les guides dans ce dépôt ou demandez de l'aide si vous rencontrez des problèmes.

---

## 📄 Licence

© 2026 Premunia. Tous droits réservés.

---

**Développé avec ❤️ pour Premunia**
