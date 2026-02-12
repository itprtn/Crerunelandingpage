import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "/utils/supabase/info";

// Re-export for convenience
export { projectId, publicAnonKey } from "/utils/supabase/info";

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Edge Function base URL - includes the function name prefix for all routes
export const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-07afcff5`;

// Helper to get access token
export const getAccessToken = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || publicAnonKey;
  } catch (error) {
    console.error("[v0] Error getting access token:", error);
    return publicAnonKey;
  }
};

// Helper to make authenticated requests
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = await getAccessToken();
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'API request failed');
  }

  return response.json().catch(() => ({}));
};
