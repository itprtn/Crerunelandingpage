/**
 * Supabase Client Configuration
 * Initialize Supabase with credentials from environment variables
 * Used for frontend authentication and database operations
 */

import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate that required environment variables are set
if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable')
}

console.log('[Supabase] Initializing with URL:', supabaseUrl)

/**
 * Create and export Supabase client
 * This client is used for:
 * - Authentication (signup, signin, signout)
 * - Real-time database operations
 * - File storage operations
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  // Enable offline support
  db: { schema: 'public' },
  // Real-time subscriptions
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

/**
 * Helper function to check Supabase connection
 * @returns Promise<boolean> - true if connection successful
 */
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('settings').select('*').limit(1)

    if (error) {
      console.error('[Supabase] Connection error:', error)
      return false
    }

    console.log('[Supabase] Connection successful ✓')
    return true
  } catch (error) {
    console.error('[Supabase] Connection check failed:', error)
    return false
  }
}

/**
 * Helper function to get current user
 * @returns Promise<User | null>
 */
export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error('[Supabase] Get user error:', error)
      return null
    }

    return user
  } catch (error) {
    console.error('[Supabase] Get user failed:', error)
    return null
  }
}

/**
 * Helper function to sign out
 * @returns Promise<void>
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('[Supabase] Sign out error:', error)
      throw error
    }

    console.log('[Supabase] Signed out successfully ✓')
  } catch (error) {
    console.error('[Supabase] Sign out failed:', error)
    throw error
  }
}

export default supabase
