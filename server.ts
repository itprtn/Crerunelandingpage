/**
 * Backend Server - Express.js
 * Manages all database operations and authentication
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query, transaction } from '../src/lib/postgres-client';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// ============================================================
// AUTHENTICATION ROUTES
// ============================================================

/**
 * Sign up
 */
app.post('/api/auth/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, first_name, last_name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await query(
      'INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name',
      [email, passwordHash, first_name || '', last_name || '']
    );

    const user = result.rows[0];

    // Create JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      success: true,
      user,
      token,
      message: 'User created successfully',
    });
  } catch (error: any) {
    console.error('[Auth] Signup error:', error);

    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }

    res.status(500).json({ error: error.message || 'Signup failed' });
  }
});

/**
 * Sign in
 */
app.post('/api/auth/signin', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const result = await query('SELECT * FROM users WHERE email = $1 AND is_active = true', [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Get user role
    const roleResult = await query(
      'SELECT role FROM user_roles WHERE user_id = $1 LIMIT 1',
      [user.id]
    );
    const role = roleResult.rows[0]?.role || 'user';

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
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
  } catch (error: any) {
    console.error('[Auth] Signin error:', error);
    res.status(500).json({ error: error.message || 'Signin failed' });
  }
});

/**
 * Get current user
 */
app.get('/api/auth/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const result = await query(
      'SELECT id, email, first_name, last_name FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Get user role
    const roleResult = await query(
      'SELECT role FROM user_roles WHERE user_id = $1 LIMIT 1',
      [userId]
    );
    const role = roleResult.rows[0]?.role || 'user';

    res.json({
      success: true,
      user: { ...user, role },
    });
  } catch (error: any) {
    console.error('[Auth] Get user error:', error);
    res.status(500).json({ error: error.message || 'Failed to get user' });
  }
});

// ============================================================
// LEADS ROUTES
// ============================================================

/**
 * Get all leads
 */
app.get('/api/leads', authenticateToken, async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT id, first_name, last_name, email, phone, profession, message, notes, status, created_at, updated_at
       FROM leads ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      leads: result.rows,
    });
  } catch (error: any) {
    console.error('[Leads] Get all error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch leads' });
  }
});

/**
 * Get a single lead
 */
app.get('/api/leads/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query('SELECT * FROM leads WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json({
      success: true,
      lead: result.rows[0],
    });
  } catch (error: any) {
    console.error('[Leads] Get one error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch lead' });
  }
});

/**
 * Create a lead (public endpoint)
 */
app.post('/api/leads', async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, phone, profession, message } = req.body;

    if (!first_name || !last_name || !email) {
      return res.status(400).json({ error: 'First name, last name, and email required' });
    }

    const result = await query(
      `INSERT INTO leads (first_name, last_name, email, phone, profession, message, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'new')
       RETURNING id, first_name, last_name, email, phone, profession, message, status, created_at`,
      [first_name, last_name, email, phone || null, profession || null, message || null]
    );

    res.status(201).json({
      success: true,
      lead: result.rows[0],
      message: 'Lead created successfully',
    });
  } catch (error: any) {
    console.error('[Leads] Create error:', error);

    if (error.code === '23505') {
      return res.status(400).json({ error: 'Lead with this email already exists' });
    }

    res.status(500).json({ error: error.message || 'Failed to create lead' });
  }
});

/**
 * Update a lead
 */
app.put('/api/leads/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone, profession, message, notes, status } =
      req.body;

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (first_name !== undefined) {
      updates.push(`first_name = $${paramCount++}`);
      values.push(first_name);
    }
    if (last_name !== undefined) {
      updates.push(`last_name = $${paramCount++}`);
      values.push(last_name);
    }
    if (email !== undefined) {
      updates.push(`email = $${paramCount++}`);
      values.push(email);
    }
    if (phone !== undefined) {
      updates.push(`phone = $${paramCount++}`);
      values.push(phone);
    }
    if (profession !== undefined) {
      updates.push(`profession = $${paramCount++}`);
      values.push(profession);
    }
    if (message !== undefined) {
      updates.push(`message = $${paramCount++}`);
      values.push(message);
    }
    if (notes !== undefined) {
      updates.push(`notes = $${paramCount++}`);
      values.push(notes);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE leads SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json({
      success: true,
      lead: result.rows[0],
      message: 'Lead updated successfully',
    });
  } catch (error: any) {
    console.error('[Leads] Update error:', error);
    res.status(500).json({ error: error.message || 'Failed to update lead' });
  }
});

/**
 * Delete a lead
 */
app.delete('/api/leads/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM leads WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error: any) {
    console.error('[Leads] Delete error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete lead' });
  }
});

// ============================================================
// SETTINGS ROUTES
// ============================================================

/**
 * Get all settings
 */
app.get('/api/settings', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM app_settings ORDER BY key');

    const settings: Record<string, any> = {};
    result.rows.forEach((row: any) => {
      settings[row.key] = row.value;
    });

    res.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    console.error('[Settings] Get all error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch settings' });
  }
});

/**
 * Get a single setting
 */
app.get('/api/settings/:key', async (req: Request, res: Response) => {
  try {
    const { key } = req.params;

    const result = await query('SELECT * FROM app_settings WHERE key = $1', [key]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    res.json({
      success: true,
      value: result.rows[0].value,
    });
  } catch (error: any) {
    console.error('[Settings] Get one error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch setting' });
  }
});

/**
 * Update a setting
 */
app.put('/api/settings/:key', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    const userId = (req as any).userId;

    const result = await query(
      `INSERT INTO app_settings (key, value, updated_by) VALUES ($1, $2, $3)
       ON CONFLICT (key) DO UPDATE SET value = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [key, value, userId]
    );

    res.json({
      success: true,
      setting: result.rows[0],
      message: 'Setting updated successfully',
    });
  } catch (error: any) {
    console.error('[Settings] Update error:', error);
    res.status(500).json({ error: error.message || 'Failed to update setting' });
  }
});

// ============================================================
// HEALTH CHECK
// ============================================================

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
  console.log('[Server] Database: Neon PostgreSQL');
});

export default app;
