# 📊 Schéma de Base de Données - Premunia CRM

Documentation complète du schéma PostgreSQL pour Premunia CRM hébergé sur Supabase.

---

## 📋 Vue d'ensemble

La base de données Supabase est composée de **7 tables principales** et plusieurs **fonctions SQL** pour gérer les leads, les paramètres, l'authentification et l'audit.

```
┌─────────────────────────────────────────────┐
│          Authentification Supabase          │
│          (Gérée automatiquement)            │
└─────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────┐
│              auth.users (Supabase)          │
│  id | email | encrypted_password | created  │
└─────────────────────────────────────────────┘
           ↓
    Références FK depuis
    /
    ├── leads.created_by
    ├── user_roles.user_id
    ├── app_settings.updated_by
    ├── smtp_config.updated_by
    ├── audit_logs.user_id
    ├── email_history
    └── lead_activities.created_by
```

---

## 📁 Tables Détaillées

### 1. 📨 `leads` - Gestion des prospects

**Description** : Stocke tous les leads (prospects) générés via le formulaire de contact ou créés manuellement.

**Colonnes** :

| Colonne | Type | Null | Clé | Description |
|---------|------|------|-----|-------------|
| `id` | UUID | NON | PK | Identifiant unique (auto-généré) |
| `first_name` | VARCHAR(255) | NON | | Prénom du prospect |
| `last_name` | VARCHAR(255) | NON | | Nom du prospect |
| `email` | VARCHAR(255) | NON | INDEX | Email du prospect |
| `phone` | VARCHAR(20) | NON | | Numéro de téléphone |
| `profession` | VARCHAR(255) | NON | | Profession/Secteur |
| `message` | TEXT | OUI | | Message du prospect |
| `status` | VARCHAR(50) | NON | INDEX | État : `new`, `contacted`, `converted`, `rejected` |
| `notes` | TEXT | OUI | | Notes internes |
| `created_by` | UUID | OUI | FK | Utilisateur Supabase qui a créé le lead |
| `created_by_admin` | UUID | OUI | FK | Admin qui a créé si création manuelle |
| `created_at` | TIMESTAMP | NON | INDEX | Date de création (UTC) |
| `updated_at` | TIMESTAMP | NON | | Dernière modification (mis à jour automatiquement) |

**Indexes** :
```sql
- idx_leads_status (pour filtrer par statut)
- idx_leads_email (pour rechercher par email)
- idx_leads_created_at (pour trier chronologiquement)
- idx_leads_created_by (pour attribuer les leads)
```

**Exemple d'insertion** :
```sql
INSERT INTO leads (first_name, last_name, email, phone, profession, message, status)
VALUES ('Jean', 'Dupont', 'jean@example.com', '06 12 34 56 78', 'Médecin', 'Intéressé par le PER', 'new');
```

---

### 2. ⚙️ `app_settings` - Paramètres du site

**Description** : Stocke les textes personnalisables de la landing page.

**Colonnes** :

| Colonne | Type | Null | Description |
|---------|------|------|-------------|
| `id` | UUID | NON | Identifiant unique |
| `hero_title` | VARCHAR(500) | OUI | Titre principal de la landing page |
| `hero_subtitle` | TEXT | OUI | Sous-titre de la landing page |
| `contact_email` | VARCHAR(255) | OUI | Email de contact affiché |
| `contact_phone` | VARCHAR(20) | OUI | Téléphone de contact affiché |
| `contact_address` | TEXT | OUI | Adresse affichée |
| `created_at` | TIMESTAMP | NON | Date de création |
| `updated_at` | TIMESTAMP | NON | Dernière modification |
| `updated_by` | UUID | OUI | Admin qui a modifié |

**Particularités** :
- Généralement une seule ligne
- Actualisable depuis `/admin/settings`

**Exemple** :
```sql
SELECT * FROM app_settings LIMIT 1;
-- Retourne : {"hero_title": "Préparez votre retraite...", ...}
```

---

### 3. 👤 `user_roles` - Rôles des utilisateurs

**Description** : Gère les rôles (admin/user) pour chaque utilisateur Supabase.

**Colonnes** :

| Colonne | Type | Null | Clé | Description |
|---------|------|------|-----|-------------|
| `id` | UUID | NON | PK | Identifiant unique |
| `user_id` | UUID | NON | FK,UNIQUE | Référence auth.users.id |
| `role` | VARCHAR(50) | NON | | `admin` ou `user` |
| `created_at` | TIMESTAMP | NON | | Date de création |
| `updated_at` | TIMESTAMP | NON | | Dernière modification |

**Indexes** :
```sql
- idx_user_roles_user_id (recherche rapide par utilisateur)
```

**Exemple** :
```sql
-- Vérifier si un utilisateur est admin
SELECT role FROM user_roles WHERE user_id = 'uuid-utilisateur' AND role = 'admin';
```

---

### 4. 📧 `smtp_config` - Configuration email

**Description** : Stocke la configuration SMTP pour l'envoi d'emails automatiques.

**Colonnes** :

| Colonne | Type | Null | Description |
|---------|------|------|-------------|
| `id` | UUID | NON | Identifiant unique |
| `host` | VARCHAR(255) | NON | Serveur SMTP (ex: smtp.gmail.com) |
| `port` | INTEGER | NON | Port SMTP (ex: 587) |
| `username` | VARCHAR(255) | NON | Utilisateur SMTP |
| `password` | VARCHAR(500) | NON | Mot de passe SMTP (chiffré par Supabase) |
| `from_email` | VARCHAR(255) | NON | Email expéditeur |
| `from_name` | VARCHAR(255) | OUI | Nom expéditeur (ex: "Premunia") |
| `created_at` | TIMESTAMP | NON | Date de création |
| `updated_at` | TIMESTAMP | NON | Dernière modification |
| `updated_by` | UUID | OUI | Admin qui a configuré |

**⚠️ Sécurité** :
- Le mot de passe est automatiquement masqué dans les réponses API
- Jamais accessible en lecture par le frontend

**Exemples** :
```sql
-- Gmail
INSERT INTO smtp_config (host, port, username, password, from_email, from_name)
VALUES ('smtp.gmail.com', 587, 'votre@gmail.com', 'mot-de-passe-app', 'votre@gmail.com', 'Premunia');

-- SendGrid
INSERT INTO smtp_config (host, port, username, password, from_email, from_name)
VALUES ('smtp.sendgrid.net', 587, 'apikey', 'SG.xxxxx', 'notifications@premunia.fr', 'Premunia');
```

---

### 5. 📋 `audit_logs` - Journalisation des actions

**Description** : Trace toutes les actions importantes pour la sécurité et l'audit.

**Colonnes** :

| Colonne | Type | Null | Description |
|---------|------|------|-------------|
| `id` | UUID | NON | Identifiant unique |
| `user_id` | UUID | OUI | Utilisateur qui a effectué l'action |
| `action` | VARCHAR(255) | NON | Description de l'action (ex: 'lead_created') |
| `resource_type` | VARCHAR(100) | OUI | Type de ressource (ex: 'lead', 'settings') |
| `resource_id` | UUID | OUI | ID de la ressource modifiée |
| `details` | JSONB | OUI | Détails additionnels (JSON) |
| `ip_address` | VARCHAR(45) | OUI | Adresse IP de l'utilisateur |
| `created_at` | TIMESTAMP | NON | Horodatage de l'action |

**Indexes** :
```sql
- idx_audit_logs_user_id
- idx_audit_logs_created_at
- idx_audit_logs_resource
```

**Exemple** :
```sql
-- Consulter qui a modifié quel lead
SELECT user_id, action, details, created_at 
FROM audit_logs 
WHERE resource_type = 'lead' AND resource_id = 'lead-uuid'
ORDER BY created_at DESC;
```

---

### 6. 📧 `email_history` - Historique des emails

**Description** : Enregistre tous les emails envoyés (actuellement ou futur).

**Colonnes** :

| Colonne | Type | Null | Description |
|---------|------|------|-------------|
| `id` | UUID | NON | Identifiant unique |
| `lead_id` | UUID | OUI | FK vers leads |
| `recipient_email` | VARCHAR(255) | OUI | Email du destinataire |
| `subject` | VARCHAR(500) | OUI | Sujet de l'email |
| `status` | VARCHAR(50) | NON | `pending`, `sent`, `failed` |
| `error_message` | TEXT | OUI | Message d'erreur si échec |
| `sent_at` | TIMESTAMP | OUI | Date d'envoi réel |
| `created_at` | TIMESTAMP | NON | Date de création |

**Indexes** :
```sql
- idx_email_history_lead_id
- idx_email_history_status
- idx_email_history_created_at
```

---

### 7. 🔔 `lead_activities` - Historique des activités sur les leads

**Description** : Trace tous les changements sur les leads (statut, notes, etc).

**Colonnes** :

| Colonne | Type | Null | Description |
|---------|------|------|-------------|
| `id` | UUID | NON | Identifiant unique |
| `lead_id` | UUID | NON | FK vers leads |
| `activity_type` | VARCHAR(100) | NON | Type : `status_change`, `note_added`, `email_sent` |
| `old_value` | JSONB | OUI | Ancienne valeur |
| `new_value` | JSONB | OUI | Nouvelle valeur |
| `created_by` | UUID | OUI | Admin qui a effectué l'action |
| `created_at` | TIMESTAMP | NON | Horodatage |

**Indexes** :
```sql
- idx_lead_activities_lead_id
- idx_lead_activities_created_at
```

**Exemple** :
```sql
-- Voir l'historique d'un lead
SELECT activity_type, old_value, new_value, created_at 
FROM lead_activities 
WHERE lead_id = 'lead-uuid'
ORDER BY created_at DESC;
```

---

## 🔐 Row Level Security (RLS)

Toutes les tables ont des politiques de sécurité :

### Policies sur `leads`
```sql
-- Publique: Créer des leads (via formulaire)
CREATE POLICY "Public can create leads" ON leads
  FOR INSERT WITH CHECK (true);

-- Authentifiés: Lire les leads
CREATE POLICY "Authenticated users can read all leads" ON leads
  FOR SELECT USING (auth.role() = 'authenticated');

-- Authentifiés: Modifier les leads
CREATE POLICY "Authenticated users can update leads" ON leads
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Authentifiés: Supprimer les leads
CREATE POLICY "Authenticated users can delete leads" ON leads
  FOR DELETE USING (auth.role() = 'authenticated');
```

### Policies sur `app_settings`
```sql
-- Publique: Lire les paramètres (pour la landing page)
CREATE POLICY "Anyone can read settings" ON app_settings
  FOR SELECT USING (true);

-- Authentifiés: Modifier les paramètres
CREATE POLICY "Authenticated users can update settings" ON app_settings
  FOR UPDATE USING (auth.role() = 'authenticated');
```

---

## 📊 Fonctions SQL

### `get_lead_statistics()`

Retourne les statistiques globales des leads.

```sql
SELECT * FROM get_lead_statistics();

-- Résultat: {
--   total_leads: 42,
--   new_leads: 15,
--   contacted_leads: 20,
--   converted_leads: 7
-- }
```

**Utilisation dans l'app** :
```typescript
const stats = await supabase
  .rpc('get_lead_statistics');
```

### `log_audit_event()`

Enregistre une action dans les logs d'audit.

```sql
SELECT log_audit_event(
  'user-uuid',           -- user_id
  'lead_status_changed', -- action
  'lead',                -- resource_type
  'lead-uuid',           -- resource_id
  '{"old": "new", "new": "contacted"}'::jsonb -- details
);
```

---

## ⏰ Triggers automatiques

### `update_*_updated_at`

Met à jour automatiquement la colonne `updated_at` :

```sql
-- Appliqué à: leads, app_settings, user_roles, smtp_config
-- Chaque UPDATE définit updated_at = NOW()
```

---

## 🔍 Requêtes utiles

### Obtenir tous les leads "new"
```sql
SELECT * FROM leads 
WHERE status = 'new'
ORDER BY created_at DESC;
```

### Obtenir les dernières activités
```sql
SELECT 
  la.activity_type,
  l.first_name || ' ' || l.last_name as lead_name,
  la.old_value,
  la.new_value,
  la.created_at
FROM lead_activities la
JOIN leads l ON la.lead_id = l.id
ORDER BY la.created_at DESC
LIMIT 10;
```

### Taux de conversion
```sql
SELECT 
  ROUND(100.0 * COUNT(CASE WHEN status = 'converted' THEN 1 END) / COUNT(*), 2) as conversion_rate
FROM leads;
```

### Statistiques par profession
```sql
SELECT 
  profession,
  COUNT(*) as total,
  COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted
FROM leads
GROUP BY profession
ORDER BY total DESC;
```

---

## 🚀 Migration et backup

### Exporter les données
```bash
# Via Supabase CLI
supabase db dump -f backup.sql

# Via PostgreSQL
pg_dump -h xxxxxxxxxxx.supabase.co -U postgres -d postgres > backup.sql
```

### Restaurer les données
```bash
psql -h xxxxxxxxxxx.supabase.co -U postgres -d postgres < backup.sql
```

---

## 📈 Performance et optimisation

### Indexes appliqués
- `leads(status)` : Filtrage rapide par statut
- `leads(email)` : Recherche par email
- `leads(created_at)` : Tri chronologique
- `user_roles(user_id)` : Lookup rapide de rôle
- `audit_logs(user_id, created_at)` : Historique utilisateur

### Recommandations
- Les tables limitent automatiquement les colonnes retournées (SELECT *)
- RLS applique les permissions avant le retour
- Pagination recommandée pour listes > 1000 lignes

---

## 🔄 Évolution future

### Tables envisagées (Niveau 3)
```
- email_templates (templates d'emails)
- campaigns (campagnes marketing)
- user_permissions (permissions granulaires)
- lead_imports (historique des imports)
- webhooks (configurations de webhooks)
```

---

**Schéma conçu pour performance, sécurité et scalabilité ! 🚀**
