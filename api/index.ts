/**
 * Vercel Serverless API - Catch All Router
 * File: /api/[...path].ts
 */

import { VercelRequest, VercelResponse } from '@vercel/node'
import { Pool } from 'pg'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

// ============================================================
// ENV
// ============================================================

const DATABASE_URL = process.env.DATABASE_URL
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-production'

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL not configured')
}

// ============================================================
// DATABASE (Neon compatible)
// ============================================================

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 5,
})

// ============================================================
// CORS
// ============================================================

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// ============================================================
// HELPERS
// ============================================================

function applyCors(res: VercelResponse) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value)
  })
}

function getPath(req: VercelRequest): string {
  const pathParam = req.query.path
  if (!pathParam) return '/'
  if (Array.isArray(pathParam)) {
    return '/' + pathParam.join('/')
  }
  return '/' + pathParam
}

function authenticateToken(req: VercelRequest): string | null {
  const authHeader = req.headers.authorization
  if (!authHeader) return null

  const token = authHeader.split(' ')[1]
  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded.userId
  } catch {
    return null
  }
}

// ============================================================
// MAIN HANDLER
// ============================================================

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyCors(res)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const path = getPath(req)
  const method = req.method
  const body = req.body || {}
  const userId = authenticateToken(req)

  console.log(`[API] ${method} ${path}`)

  try {
    // ============================================================
    // HEALTH
    // ============================================================

    if (path === '/' || path === '/health') {
      await pool.query('SELECT 1')
      return res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'connected',
      })
    }

    // ============================================================
    // AUTH
    // ============================================================

    if (path === '/auth/signup' && method === 'POST') {
      const { email, password, first_name, last_name } = body

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' })
      }

      const passwordHash = await bcrypt.hash(password, 10)

      const result = await pool.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, is_active)
         VALUES ($1,$2,$3,$4,true)
         RETURNING id,email,first_name,last_name`,
        [email, passwordHash, first_name || '', last_name || '']
      )

      const user = result.rows[0]

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      return res.status(201).json({ success: true, user, token })
    }

    if (path === '/auth/signin' && method === 'POST') {
      const { email, password } = body

      const result = await pool.query(
        'SELECT * FROM users WHERE email=$1 AND is_active=true',
        [email]
      )

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      const user = result.rows[0]

      const valid = await bcrypt.compare(password, user.password_hash)
      if (!valid) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
        },
        token,
      })
    }

    if (path === '/auth/me' && method === 'GET') {
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const result = await pool.query(
        'SELECT id,email,first_name,last_name FROM users WHERE id=$1',
        [userId]
      )

      return res.status(200).json({ success: true, user: result.rows[0] })
    }

    // ============================================================
    // LEADS
    // ============================================================

    if (path === '/leads' && method === 'GET') {
      const result = await pool.query(
        'SELECT * FROM leads ORDER BY created_at DESC'
      )

      return res.status(200).json({
        success: true,
        leads: result.rows,
      })
    }

    if (path === '/leads' && method === 'POST') {
      const { first_name, last_name, email, phone, profession, message } = body

      if (!first_name || !last_name || !email) {
        return res.status(400).json({
          error: 'First name, last name and email required',
        })
      }

      const result = await pool.query(
        `INSERT INTO leads 
        (first_name,last_name,email,phone,profession,message,status)
        VALUES ($1,$2,$3,$4,$5,$6,'new')
        RETURNING *`,
        [
          first_name,
          last_name,
          email,
          phone || null,
          profession || null,
          message || null,
        ]
      )

      return res.status(201).json({
        success: true,
        lead: result.rows[0],
      })
    }

    // ============================================================
    // SETTINGS
    // ============================================================

    if (path === '/settings' && method === 'GET') {
      const result = await pool.query(
        'SELECT key,value FROM app_settings'
      )

      const settings: Record<string, any> = {}
      result.rows.forEach((row: any) => {
        settings[row.key] = row.value
      })

      return res.status(200).json({
        success: true,
        settings,
      })
    }

    // ============================================================
    // 404
    // ============================================================

    return res.status(404).json({ error: 'Endpoint not found' })
  } catch (error: any) {
    console.error('[API ERROR]', error)
    return res.status(500).json({
      error: error.message || 'Internal server error',
    })
  }
}
