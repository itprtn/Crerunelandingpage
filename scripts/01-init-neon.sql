-- ============================================================
-- PREMUNIA CRM - NEON POSTGRESQL DATABASE SCHEMA
-- ============================================================
-- For native PostgreSQL (Neon) without Supabase
-- Tables: 5 core tables
-- ============================================================

-- ============================================================
-- 1. USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
  last_name VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);

-- ============================================================
-- 2. LEADS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  profession VARCHAR(255),
  message TEXT,
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'archived')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

-- ============================================================
-- 3. USER_ROLES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS user_roles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);

-- ============================================================
-- 4. APP_SETTINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS app_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_app_settings_key ON app_settings(key);

-- Insert default settings
INSERT INTO app_settings (key, value, description) VALUES
('site_name', 'Premunia CRM', 'Application name'),
('site_url', 'https://premunia.netlify.app', 'Site URL'),
('support_email', 'support@premunia.com', 'Support email'),
('enable_registrations', 'true', 'Allow new user registrations')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- 5. AUDIT_LOGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  resource VARCHAR(255),
  resource_id INTEGER,
  details TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
