/**
 * Netlify Function - API Handler
 * Proxy for all /api/* requests
 * Connects to Neon PostgreSQL
 */

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
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

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const { httpMethod, path, body, headers } = event;

  console.log(`[API] ${httpMethod} ${path}`);

  // CORS preflight
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ ok: true }),
    };
  }

  try {
    const bodyData = body ? JSON.parse(body) : {};
    const userId = authenticateToken(headers);

    // ============================================================
    // HEALTH CHECK (no auth required)
    // ============================================================
    if (path === '/health' || path === '/health/' || path === '' || path === '/') {
      try {
        const result = await query('SELECT NOW()');
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ 
            status: 'ok', 
            timestamp: new Date().toISOString(),
            database: 'connected'
          }),
        };
      } catch (error: any) {
        return {
          statusCode: 503,
          headers: corsHeaders,
          body: JSON.stringify({ 
            status: 'error',
            error: 'Database connection failed',
            details: error.message
          }),
        };
      }
    }

    // ============================================================
    // AUTH ROUTES
    // ============================================================

    // Sign up
    if (path === '/auth/signup' && httpMethod === 'POST') {
      const { email, password, first_name, last_name } = bodyData;

      if (!email || !password) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Email and password required' }),
        };
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

        return {
          statusCode: 201,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            user,
            token,
            message: 'User created successfully',
          }),
        };
      } catch (error: any) {
        if (error.code === '23505') {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Email already exists' }),
          };
        }
        throw error;
      }
    }

    if (path === '/auth/signin' && httpMethod === 'POST') {
      const { email, password } = bodyData;

      if (!email || !password) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Email and password required' }),
        };
      }

      const result = await query('SELECT * FROM users WHERE email = $1 AND is_active = true', [
        email,
      ]);

      if (result.rows.length === 0) {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Invalid credentials' }),
        };
      }

      const user = result.rows[0];
      const isValid = await bcrypt.compare(password, user.password_hash);

      if (!isValid) {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Invalid credentials' }),
        };
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

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role,
          },
          token,
        }),
      };
    }

    if (path === '/auth/me' && httpMethod === 'GET') {
      if (!userId) {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Access token required' }),
        };
      }

      const result = await query(
        'SELECT id, email, first_name, last_name FROM users WHERE id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'User not found' }),
        };
      }

      const user = result.rows[0];
      const roleResult = await query(
        'SELECT role FROM user_roles WHERE user_id = $1 LIMIT 1',
        [userId]
      );
      const role = roleResult.rows[0]?.role || 'user';

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          user: { ...user, role },
        }),
      };
    }

    // LEADS ROUTES
    if (path === '/leads' && httpMethod === 'GET') {
      if (!userId) {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Authentication required' }),
        };
      }

      const result = await query(
        'SELECT id, first_name, last_name, email, phone, profession, message, notes, status, created_at, updated_at FROM leads ORDER BY created_at DESC'
      );

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          leads: result.rows,
        }),
      };
    }

    if (path === '/leads' && httpMethod === 'POST') {
      const { first_name, last_name, email, phone, profession, message } = bodyData;

      if (!first_name || !last_name || !email) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'First name, last name, and email required' }),
        };
      }

      try {
        const result = await query(
          `INSERT INTO leads (first_name, last_name, email, phone, profession, message, status)
           VALUES ($1, $2, $3, $4, $5, $6, 'new')
           RETURNING id, first_name, last_name, email, phone, profession, message, status, created_at`,
          [first_name, last_name, email, phone || null, profession || null, message || null]
        );

        return {
          statusCode: 201,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            lead: result.rows[0],
            message: 'Lead created successfully',
          }),
        };
      } catch (error: any) {
        if (error.code === '23505') {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Lead with this email already exists' }),
          };
        }
        throw error;
      }
    }

    // SETTINGS ROUTES
    if (path === '/settings' && httpMethod === 'GET') {
      try {
        const result = await query('SELECT * FROM app_settings ORDER BY key');

        const settings: Record<string, any> = {};
        result.rows.forEach((row: any) => {
          settings[row.key] = row.value;
        });

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            settings: settings || {},
          }),
        };
      } catch (error: any) {
        // If table doesn't exist, return empty settings
        if (error.code === '42P01') {
          console.log('[API] Settings table does not exist, returning empty settings');
          return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
              success: true,
              settings: {},
            }),
          };
        }
        console.error('[API] Settings fetch error:', error.message);
        throw error;
      }
    }

    // LEADS ROUTES with auth check
    if (path === '/leads' && httpMethod === 'GET') {
      try {
        const result = await query(
          'SELECT id, first_name, last_name, email, phone, profession, message, notes, status, created_at, updated_at FROM leads ORDER BY created_at DESC'
        );

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            leads: result.rows,
          }),
        };
      } catch (error: any) {
        // If table doesn't exist, return empty leads
        if (error.code === '42P01') {
          console.log('[API] Leads table does not exist, returning empty leads');
          return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
              success: true,
              leads: [],
            }),
          };
        }
        console.error('[API] Leads fetch error:', error.message);
        throw error;
      }
    }

    // HEALTH CHECK
    if (path === '/health') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }),
      };
    }

    // 404
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Endpoint not found' }),
    };
  } catch (error: any) {
    console.error('[API] Error:', error);

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: error.message || 'Internal server error',
      }),
    };
  }
};
