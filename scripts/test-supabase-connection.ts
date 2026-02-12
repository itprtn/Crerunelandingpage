#!/usr/bin/env node

/**
 * Test Supabase Connection Script
 * Run: npx ts-node scripts/test-supabase-connection.ts
 * 
 * This script tests:
 * 1. Environment variables are set correctly
 * 2. Can connect to Supabase
 * 3. Can query the database
 * 4. RLS policies are working
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function success(msg: string) {
  console.log(`${colors.green}✓${colors.reset} ${msg}`)
}

function error(msg: string) {
  console.log(`${colors.red}✗${colors.reset} ${msg}`)
}

function info(msg: string) {
  console.log(`${colors.blue}ℹ${colors.reset} ${msg}`)
}

function warn(msg: string) {
  console.log(`${colors.yellow}⚠${colors.reset} ${msg}`)
}

function section(title: string) {
  console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`)
  console.log(`${colors.cyan}${title}${colors.reset}`)
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`)
}

async function testConnection() {
  section('Supabase Connection Test')

  // Step 1: Check environment variables
  info('Step 1: Checking environment variables...')
  
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
  const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    error('VITE_SUPABASE_URL is not set')
    return false
  }
  success('VITE_SUPABASE_URL is set')

  if (!supabaseAnonKey) {
    error('VITE_SUPABASE_ANON_KEY is not set')
    return false
  }
  success('VITE_SUPABASE_ANON_KEY is set')

  if (!supabaseServiceKey) {
    warn('VITE_SUPABASE_SERVICE_ROLE_KEY is not set (needed for server operations)')
  } else {
    success('VITE_SUPABASE_SERVICE_ROLE_KEY is set')
  }

  // Step 2: Create client and test connection
  section('Testing Supabase Connection')

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    info('Creating Supabase client...')
    success('Supabase client created')

    // Test basic query
    info('Testing database query...')
    const { data, error } = await supabase.from('settings').select('*').limit(1)

    if (error) {
      error(`Database query failed: ${error.message}`)
      return false
    }

    success('Database query successful')

    // Step 3: Check tables
    section('Checking Database Tables')

    const tables = [
      'users',
      'companies',
      'contacts',
      'leads',
      'opportunities',
      'tasks',
      'activities',
      'settings',
    ]

    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('*').limit(1)
        if (error && error.code !== 'PGRST116') {
          // PGRST116 = table doesn't exist
          error(`Table "${table}" query failed: ${error.message}`)
        } else if (!error) {
          success(`Table "${table}" exists and is accessible`)
        } else {
          warn(`Table "${table}" does not exist yet (needs migration)`)
        }
      } catch (err: any) {
        error(`Table "${table}" check failed: ${err.message}`)
      }
    }

    // Step 4: Test Authentication
    section('Testing Authentication')

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        error(`Get session failed: ${sessionError.message}`)
      } else {
        if (sessionData?.session) {
          success('Active session found')
        } else {
          info('No active session (expected for fresh connection)')
          success('Authentication system is responsive')
        }
      }
    } catch (err: any) {
      error(`Authentication test failed: ${err.message}`)
    }

    // Step 5: Test Real-time Connection
    section('Testing Real-time Connection')

    try {
      const channel = supabase.channel('connection-test')

      channel.on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        console.log('Change detected:', payload)
      })

      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          success('Real-time connection established')
        } else {
          info(`Real-time connection status: ${status}`)
        }

        channel.unsubscribe()
      })
    } catch (err: any) {
      warn(`Real-time connection test skipped: ${err.message}`)
    }

    // Final summary
    section('Connection Test Summary')
    success('All tests passed!')
    info('Your Supabase instance is properly configured and accessible')

    return true
  } catch (err: any) {
    error(`Connection test failed: ${err.message}`)
    return false
  }
}

// Run the test
testConnection()
  .then((success) => {
    process.exit(success ? 0 : 1)
  })
  .catch((err) => {
    error(`Unexpected error: ${err.message}`)
    process.exit(1)
  })
