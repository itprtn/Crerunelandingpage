# 🏗️ Architecture Technique Premunia CRM

## 📂 Structure du projet

```
/
├── src/
│   ├── app/
│   │   ├── App.tsx                    # Point d'entrée avec React Router et React Query
│   │   ├── routes.ts                  # Configuration des routes
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx        # Page publique d'accueil
│   │   │   ├── SignIn.tsx             # Page de connexion
│   │   │   ├── SignUp.tsx             # Page d'inscription
│   │   │   ├── PromoteAdmin.tsx       # Page temporaire de promotion admin
│   │   │   ├── Admin.tsx              # Dashboard admin
│   │   │   ├── AdminLeads.tsx         # Gestion des leads
│   │   │   ├── AdminSettings.tsx      # Paramètres du site
│   │   │   └── AdminAutomation.tsx    # Configuration SMTP
│   │   └── components/                # Composants UI (Radix UI)
│   ├── utils/
│   │   ├── supabase.tsx              # Client Supabase et helpers API
│   │   └── supabase/
│   │       └── info.tsx              # IDs et clés Supabase (autogénéré)
│   └── styles/
│       ├── index.css                 # Styles globaux
│       ├── theme.css                 # Variables de thème
│       └── fonts.css                 # Imports de polices
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx             # Backend Hono avec routes API
│           └── kv_store.tsx          # Utilitaire Key-Value store (protégé)
└── utils/
    └── supabase/
        └── info.tsx                  # Configuration Supabase (protégé)
```

---

## 🔧 Stack Technique

### Frontend
- **React 18.3.1** : Interface utilisateur
- **React Router 7.13.0** : Navigation (Data mode)
- **TanStack React Query** : Gestion du cache et des requêtes API
- **Tailwind CSS v4** : Styling moderne
- **Recharts** : Graphiques et visualisations
- **Sonner** : Notifications toast
- **Lucide React** : Icônes
- **Radix UI** : Composants accessibles

### Backend
- **Supabase** : Base de données PostgreSQL + Auth + Edge Functions
- **Hono** : Framework web ultra-rapide pour Deno
- **Deno** : Runtime pour Edge Functions

### Authentification
- **Supabase Auth** : Gestion sécurisée des utilisateurs

### Stockage
- **KV Store** : Table clé-valeur pour leads, paramètres et config SMTP

---

## 🗄️ Structure de données (KV Store)

### Leads
**Clé** : `lead_{timestamp}_{random}`

**Valeur** :
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

### Paramètres du site
**Clé** : `app_settings`

**Valeur** :
```typescript
{
  hero_title: string,
  hero_subtitle: string,
  contact_email: string,
  contact_phone: string,
  contact_address: string
}
```

### Rôles utilisateurs
**Clé** : `user_role_{user_id}`

**Valeur** :
```typescript
{
  role: 'admin' | 'user',
  updated_at: string
}
```

### Configuration SMTP
**Clé** : `smtp_config`

**Valeur** :
```typescript
{
  host: string,
  port: string,
  user: string,
  password: string,
  from_email: string,
  from_name: string
}
```

---

## 🌐 Routes API Backend

Toutes les routes sont préfixées par `/make-server-07afcff5`

### Routes publiques
- `GET /health` - Health check
- `GET /settings` - Récupérer les paramètres du site
- `POST /leads` - Créer un nouveau lead
- `POST /signup` - Inscription d'un nouvel utilisateur

### Routes protégées (requiert authentification)
- `GET /leads` - Liste de tous les leads
- `PUT /leads/:id` - Modifier un lead
- `DELETE /leads/:id` - Supprimer un lead
- `PUT /settings` - Modifier les paramètres du site
- `GET /user/role` - Récupérer le rôle de l'utilisateur
- `POST /promote-admin` - Promouvoir l'utilisateur en admin
- `GET /smtp-config` - Récupérer la config SMTP
- `PUT /smtp-config` - Modifier la config SMTP

---

## 🔐 Flux d'authentification

### 1. Inscription (`/signup`)
```
Frontend → Backend /signup → Supabase Auth (createUser)
                           → Auto-confirm email
                           → Retour user créé
Frontend → Supabase Auth (signInWithPassword)
        → Redirection vers /promote-admin
```

### 2. Connexion (`/signin`)
```
Frontend → Supabase Auth (signInWithPassword)
        → Récupération du access_token
        → Stockage dans session Supabase
        → Redirection vers /admin
```

### 3. Vérification d'auth sur pages protégées
```
useEffect → Supabase getSession()
         → Si pas de session → Redirect /signin
         → Si session → Continue
```

### 4. Appels API authentifiés
```
apiCall() → getAccessToken() → Supabase getSession()
                             → Récupère access_token
         → Fetch avec Authorization: Bearer {token}
Backend → Supabase getUser(token)
       → Si user valide → Continue
       → Si invalide → 401 Unauthorized
```

---

## 🎨 Charte Graphique

### Couleurs Premunia
Définies directement dans les composants :

```typescript
const COLORS = {
  orange: "#F79E1B",   // Orange principal
  coral: "#EE3B33",    // Rouge Premunia
  magenta: "#E91E63",  // Magenta accent
  purple: "#880E4F",   // Violet foncé
};
```

### Utilisées pour :
- **Orange** : Badges, icônes, accents positifs
- **Rouge Premunia** : CTAs, boutons principaux
- **Magenta** : Accents secondaires
- **Violet** : Hover states, sections sombres

---

## 🔄 Gestion d'état

### React Query
- **Cache automatique** des requêtes
- **Invalidation** après mutations (create, update, delete)
- **Refetch** désactivé sur window focus pour optimiser les perfs

### Exemple de mutation :
```typescript
const leadMutation = useMutation({
  mutationFn: (formData) => apiCall('/leads', { 
    method: 'POST', 
    body: JSON.stringify(formData) 
  }),
  onSuccess: () => {
    toast.success('Lead créé !');
    queryClient.invalidateQueries(['admin-leads']); // Refresh la liste
  }
});
```

---

## 🚦 Workflow d'un nouveau lead

```
1. Utilisateur remplit le formulaire sur /
   ↓
2. POST /make-server-07afcff5/leads (public)
   ↓
3. Backend crée un ID unique : lead_{timestamp}_{random}
   ↓
4. Stockage dans KV store avec status: 'new'
   ↓
5. (Future) Envoi email automatique via SMTP
   ↓
6. Retour success au frontend
   ↓
7. Toast de confirmation
   ↓
8. Lead visible immédiatement dans /admin/leads
```

---

## 🔒 Sécurité

### Authentification
- Tokens JWT gérés par Supabase Auth
- Vérification sur chaque requête backend protégée
- Session stockée côté client de manière sécurisée

### Protection des routes
- Routes admin vérifiées côté frontend (useEffect)
- Routes API vérifiées côté backend (getUser)
- Double validation pour sécurité maximale

### Données sensibles
- Mot de passe SMTP stocké dans KV (chiffré côté Supabase)
- Jamais retourné dans les réponses GET (supprimé avant envoi)
- SERVICE_ROLE_KEY uniquement côté backend

### Fichiers protégés
Les fichiers suivants ne doivent JAMAIS être modifiés :
- `/supabase/functions/server/kv_store.tsx`
- `/utils/supabase/info.tsx`
- `/src/app/components/figma/ImageWithFallback.tsx`

---

## 📊 Performance

### Optimisations frontend
- Lazy loading des routes (React Router)
- Cache des requêtes (React Query)
- Images optimisées (Unsplash + cdn)
- Tailwind CSS purge automatique

### Optimisations backend
- Edge Functions (déploiement global)
- KV Store ultra-rapide
- CORS configuré pour performances

---

## 🚀 Déploiement

### Build production
```bash
npm run build
```

### Variables d'environnement (Backend)
Automatiquement fournies par Supabase :
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## 🛠️ Extensions futures possibles

### Niveau 1 (Simple)
- Export CSV des leads
- Filtres avancés (date, profession, statut)
- Pagination pour grandes listes

### Niveau 2 (Moyen)
- Templates d'emails personnalisables
- Envoi d'emails manuels depuis l'interface
- Pièces jointes sur les leads

### Niveau 3 (Avancé)
- Workflows multi-étapes
- Intégration calendrier (RDV)
- Statistiques avancées avec graphiques
- Multi-utilisateurs avec permissions granulaires
- Historique d'activité complet
- API REST publique

---

## 📝 Notes importantes

### À faire après première utilisation
1. ✅ Créer votre compte admin
2. ✅ Vous promouvoir en admin via /promote-admin
3. ❌ **SUPPRIMER** `/src/app/pages/PromoteAdmin.tsx`
4. ❌ **RETIRER** la route dans `/src/app/routes.ts`
5. ✅ Configurer SMTP dans /admin/automation
6. ✅ Personnaliser les textes dans /admin/settings

### Dépendances clés
```json
{
  "@tanstack/react-query": "^5.90.21",
  "@supabase/supabase-js": "^2.95.3",
  "react-router": "7.13.0",
  "recharts": "2.15.2",
  "sonner": "2.0.3",
  "lucide-react": "0.487.0"
}
```

---

## 🤝 Contribution

Pour ajouter des fonctionnalités :

1. **Frontend** : Créer un composant dans `/src/app/pages/`
2. **Backend** : Ajouter une route dans `/supabase/functions/server/index.tsx`
3. **Route** : Enregistrer dans `/src/app/routes.ts`
4. **API Call** : Utiliser `apiCall()` depuis `/src/utils/supabase.tsx`

---

**Architecture conçue pour être évolutive, sécurisée et performante ! 🚀**
