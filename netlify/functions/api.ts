/**
 * Netlify Function - API Handler
 * Proxy for all /api/* requests
 * Connects to Neon PostgreSQL
 */

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Initialize database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Authentication middleware
const authenticateToken = (headers: any): string | null => {
  const authHeader = headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.userId;
  } catch (error) {
    return null;
  }
};

// Query helper
const query = async (text: string, params?: any[]) => {
  try {
    return await pool.query(text, params);
  } catch (error) {
    console.error('[API] Query error:', error);
    throw error;
  }
};

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const { httpMethod, path, body, headers } = event;

  // CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

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

    // AUTH ROUTES
    if (path === '/.netlify/functions/api/auth/signup' && httpMethod === 'POST') {
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
          'INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name',
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

    if (path === '/.netlify/functions/api/auth/signin' && httpMethod === 'POST') {
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

    if (path === '/.netlify/functions/api/auth/me' && httpMethod === 'GET') {
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
    if (path === '/.netlify/functions/api/leads' && httpMethod === 'GET') {
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

    if (path === '/.netlify/functions/api/leads' && httpMethod === 'POST') {
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
    if (path === '/.netlify/functions/api/settings' && httpMethod === 'GET') {
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
          settings,
        }),
      };
    }

    // HEALTH CHECK
    if (path === '/.netlify/functions/api/health') {
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
