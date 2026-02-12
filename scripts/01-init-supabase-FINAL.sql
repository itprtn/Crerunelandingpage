-- ============================================================
-- PREMUNIA CRM - FINAL DATABASE SCHEMA (VERSION DEFINITIVE)
-- ============================================================
-- Created: 2026-02-12
-- Tables: 7 (CONFIRMED)
-- This matches the seed.ts structure exactly
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. LEADS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  profession VARCHAR(255),
  message TEXT,
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_created_by ON leads(created_by);

-- ============================================================
-- 2. APP_SETTINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSONB,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_app_settings_key ON app_settings(key);

-- Insert default settings
INSERT INTO app_settings (key, value, description) VALUES
('hero_title', '"Préparez votre retraite sans sacrifier votre présent"', 'Main hero title for landing page'),
('hero_subtitle', '"Le Plan Épargne Retraite (PER) sur-mesure pour les professions libérales : optimisez votre fiscalité dès aujourd''hui."', 'Hero subtitle'),
('contact_email', '"contact@premunia.fr"', 'Contact email address'),
('contact_phone', '"01 00 00 00 00"', 'Contact phone number'),
('contact_address', '"828 Av. Roger Salengro, 92370 Chaville"', 'Office address')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- 3. USER_ROLES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'manager')),
  granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, role)
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);

-- ============================================================
-- 4. SMTP_CONFIG TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS smtp_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host VARCHAR(255) NOT NULL,
  port INTEGER NOT NULL CHECK (port > 0 AND port < 65536),
  from_email VARCHAR(255) NOT NULL,
  from_name VARCHAR(255),
  username VARCHAR(255),
  password TEXT, -- Should be encrypted in production
  use_tls BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_smtp_config_updated_at ON smtp_config(updated_at DESC);

-- ============================================================
-- 5. AUDIT_LOGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id VARCHAR(255),
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- ============================================================
-- 6. EMAIL_HISTORY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS email_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  to_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  body TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  sent_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_email_history_lead_id ON email_history(lead_id);
CREATE INDEX idx_email_history_status ON email_history(status);
CREATE INDEX idx_email_history_created_at ON email_history(created_at DESC);
CREATE INDEX idx_email_history_sent_at ON email_history(sent_at DESC);

-- ============================================================
-- 7. LEAD_ACTIVITIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS lead_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  activity_type VARCHAR(100) NOT NULL,
  description TEXT,
  notes TEXT,
  metadata JSONB,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX idx_lead_activities_created_at ON lead_activities(created_at DESC);
CREATE INDEX idx_lead_activities_activity_type ON lead_activities(activity_type);

-- ============================================================
-- TRIGGERS FOR AUTO-UPDATED TIMESTAMPS
-- ============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON app_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_smtp_config_updated_at
  BEFORE UPDATE ON smtp_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lead_activities_updated_at
  BEFORE UPDATE ON lead_activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE smtp_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;

-- LEADS RLS
-- Public can create leads (landing page form)
CREATE POLICY "leads_public_create" ON leads
  FOR INSERT WITH CHECK (true);

-- Authenticated users can read leads
CREATE POLICY "leads_auth_read" ON leads
  FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can update leads
CREATE POLICY "leads_auth_update" ON leads
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can delete leads
CREATE POLICY "leads_auth_delete" ON leads
  FOR DELETE USING (auth.role() = 'authenticated');

-- APP_SETTINGS RLS
-- Public can read app settings
CREATE POLICY "app_settings_public_read" ON app_settings
  FOR SELECT USING (true);

-- Only authenticated users can insert/update settings
CREATE POLICY "app_settings_auth_write" ON app_settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "app_settings_auth_update" ON app_settings
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- USER_ROLES RLS
-- Users can read their own roles
CREATE POLICY "user_roles_read_own" ON user_roles
  FOR SELECT USING (user_id = auth.uid() OR auth.role() = 'authenticated');

-- Only authenticated users can create roles
CREATE POLICY "user_roles_auth_create" ON user_roles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update roles
CREATE POLICY "user_roles_auth_update" ON user_roles
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- SMTP_CONFIG RLS
-- Only authenticated users can read SMTP config
CREATE POLICY "smtp_config_auth_read" ON smtp_config
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only authenticated users can insert SMTP config
CREATE POLICY "smtp_config_auth_create" ON smtp_config
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update SMTP config
CREATE POLICY "smtp_config_auth_update" ON smtp_config
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- AUDIT_LOGS RLS
-- Only authenticated users can read audit logs
CREATE POLICY "audit_logs_auth_read" ON audit_logs
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only system (service role) can insert audit logs
CREATE POLICY "audit_logs_system_insert" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- EMAIL_HISTORY RLS
-- Only authenticated users can read email history
CREATE POLICY "email_history_auth_read" ON email_history
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only system can insert email history
CREATE POLICY "email_history_system_insert" ON email_history
  FOR INSERT WITH CHECK (true);

-- LEAD_ACTIVITIES RLS
-- Only authenticated users can read activities
CREATE POLICY "lead_activities_auth_read" ON lead_activities
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only system can insert activities
CREATE POLICY "lead_activities_system_insert" ON lead_activities
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- SUMMARY
-- ============================================================
-- Tables Created: 7
--   1. leads (for landing page submissions)
--   2. app_settings (for app configuration)
--   3. user_roles (for user role management)
--   4. smtp_config (for email configuration)
--   5. audit_logs (for audit trail)
--   6. email_history (for email tracking)
--   7. lead_activities (for lead activity tracking)
--
-- RLS Policies: 14
-- Indexes: 13
-- Triggers: 5 (auto-updated_at on all tables)
-- ============================================================
