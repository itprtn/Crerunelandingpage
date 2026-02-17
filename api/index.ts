/**
 * Vercel Serverless Function - API Handler
 * Proxy for all /api/* requests
 * Connects to Neon PostgreSQL
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool, QueryResult } from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// ============================================================
// DATABASE SETUP
// ============================================================

const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

let pool: Pool | null = null;

// Initialize pool on first use
function getPool(): Pool {
  if (pool) return pool;
  
  if (!DATABASE_URL) {
    const msg = 'DATABASE_URL not configured';
    console.error('[API] FATAL:', msg);
    throw new Error(msg);
  }

  try {
    pool = new Pool({
      connectionString: DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    pool.on('error', (err) => {
      console.error('[POOL] Error:', err);
    });

    console.log('[API] Pool initialized');
    return pool;
  } catch (error) {
    const msg = `Failed to create pool: ${error}`;
    console.error('[API] FATAL:', msg);
    throw error;
  }
}

async function query(text: string, params?: any[]): Promise<QueryResult> {
  const p = getPool();
  try {
    return await p.query(text, params);
  } catch (error: any) {
    console.error('[API] Query failed:', error.message);
    throw error;
  }
}

// Authentication middleware
function authenticateToken(headers: any): string | null {
  const authHeader = headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

// ============================================================
// CORS HEADERS
// ============================================================

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// ============================================================
// MAIN HANDLER
// ============================================================

export default async (req: VercelRequest, res: VercelResponse) => {
  const { method, query: queryParams, body, headers } = req;
  
  // Extract path from query parameter or use root
  const path = `/${(queryParams.path as string) || ''}`.replace(/\/+/g, '/');

  console.log(`[API] ${method} ${path}`);

  // CORS preflight
  if (method === 'OPTIONS') {
    res.status(200).setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.json({ ok: true });
  }

  try {
    const bodyData = body || {};
    const userId = authenticateToken(headers);

    // ============================================================
    // HEALTH CHECK (no auth required)
    // ============================================================
    if (path === '/' || path === '/health' || path === '/health/') {
      try {
        const result = await query('SELECT NOW()');
        return res.status(200).json({ 
          status: 'ok', 
          timestamp: new Date().toISOString(),
          database: 'connected'
        });
      } catch (error: any) {
        return res.status(503).json({ 
          status: 'error',
          error: 'Database connection failed',
          details: error.message
        });
      }
    }

    // ============================================================
    // AUTH ROUTES
    // ============================================================

    // Sign up
    if (path === '/auth/signup' && method === 'POST') {
      const { email, password, first_name, last_name } = bodyData;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      try {
        const passwordHash = await bcrypt.hash(password, 10);
        const result = await query(
          'INSERT INTO users (email, password_hash, first_name, last_name, is_active) VALUES ($1, $2, $3, $4, true) RETURNING id, email, first_name, last_name',
          [email, passwordHash, first_name || '', last_name || '']
        );

        const user = result.rows[0];
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
          expiresIn: '7d',
        });

        return res.status(201).json({
          success: true,
          user,
          token,
          message: 'User created successfully',
        });
      } catch (error: any) {
        if (error.code === '23505') {
          return res.status(400).json({ error: 'Email already exists' });
        }
        throw error;
      }
    }

    if (path === '/auth/signin' && method === 'POST') {
      const { email, password } = bodyData;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const result = await query('SELECT * FROM users WHERE email = $1 AND is_active = true', [
        email,
      ]);

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = result.rows[0];
      const isValid = await bcrypt.compare(password, user.password_hash);

      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const roleResult = await query(
        'SELECT role FROM user_roles WHERE user_id = $1 LIMIT 1',
        [user.id]
      );
      const role = roleResult.rows[0]?.role || 'user';

      const token = jwt.sign(
        { userId: user.id, email: user.email, role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role,
        },
        token,
      });
    }

    if (path === '/auth/me' && method === 'GET') {
      if (!userId) {
        return res.status(401).json({ error: 'Access token required' });
      }

      const result = await query(
        'SELECT id, email, first_name, last_name FROM users WHERE id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = result.rows[0];
      const roleResult = await query(
        'SELECT role FROM user_roles WHERE user_id = $1 LIMIT 1',
        [userId]
      );
      const role = roleResult.rows[0]?.role || 'user';

      return res.status(200).json({
        success: true,
        user: { ...user, role },
      });
    }

    // ============================================================
    // LEADS ROUTES
    // ============================================================
    if (path === '/leads' && method === 'GET') {
      try {
        const result = await query(
          'SELECT id, first_name, last_name, email, phone, profession, message, notes, status, created_at, updated_at FROM leads ORDER BY created_at DESC'
        );

        return res.status(200).json({
          success: true,
          leads: result.rows,
        });
      } catch (error: any) {
        // If table doesn't exist, return empty leads
        if (error.code === '42P01') {
          console.log('[API] Leads table does not exist, returning empty leads');
          return res.status(200).json({
            success: true,
            leads: [],
          });
        }
        console.error('[API] Leads fetch error:', error.message);
        throw error;
      }
    }

    if (path === '/leads' && method === 'POST') {
      const { first_name, last_name, email, phone, profession, message } = bodyData;

      if (!first_name || !last_name || !email) {
        return res.status(400).json({ error: 'First name, last name, and email required' });
      }

      try {
        const result = await query(
          `INSERT INTO leads (first_name, last_name, email, phone, profession, message, status)
           VALUES ($1, $2, $3, $4, $5, $6, 'new')
           RETURNING id, first_name, last_name, email, phone, profession, message, status, created_at`,
          [first_name, last_name, email, phone || null, profession || null, message || null]
        );

        return res.status(201).json({
          success: true,
          lead: result.rows[0],
          message: 'Lead created successfully',
        });
      } catch (error: any) {
        if (error.code === '23505') {
          return res.status(400).json({ error: 'Lead with this email already exists' });
        }
        throw error;
      }
    }

    // ============================================================
    // SETTINGS ROUTES
    // ============================================================
    if (path === '/settings' && method === 'GET') {
      try {
        const result = await query('SELECT * FROM app_settings ORDER BY key');

        const settings: Record<string, any> = {};
        result.rows.forEach((row: any) => {
          settings[row.key] = row.value;
        });

        return res.status(200).json({
          success: true,
          settings: settings || {},
        });
      } catch (error: any) {
        // If table doesn't exist, return empty settings
        if (error.code === '42P01') {
          console.log('[API] Settings table does not exist, returning empty settings');
          return res.status(200).json({
            success: true,
            settings: {},
          });
        }
        console.error('[API] Settings fetch error:', error.message);
        throw error;
      }
    }

    // ============================================================
    // 404
    // ============================================================
    return res.status(404).json({ error: 'Endpoint not found' });
  } catch (error: any) {
    console.error('[API] Error:', error);

    return res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
};
