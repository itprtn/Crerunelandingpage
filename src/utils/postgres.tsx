/**
 * API utilities - replaces Supabase client
 * All database operations go through API endpoints
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Get API base URL
 */
export function getApiBaseUrl(): string {
  const env = import.meta.env.MODE;
  if (env === 'development') {
    return import.meta.env.VITE_API_URL || 'http://localhost:3001';
  }
  return import.meta.env.VITE_API_URL || '/api';
}

/**
 * Make authenticated API call
 */
export async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  const token = localStorage.getItem('auth_token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || errorData.message || 'API request failed');
  }

  const data = await response.json();
  return data;
}

/**
 * Auth utilities
 */
export const auth = {
  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string, firstName: string, lastName: string) {
    return apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, first_name: firstName, last_name: lastName }),
    });
  },

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string) {
    const response = await apiCall<{ token: string; user: any }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }

    return response;
  },

  /**
   * Sign out
   */
  signOut() {
    localStorage.removeItem('auth_token');
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;

      return await apiCall('/auth/me');
    } catch (error) {
      console.error('[Auth] Error getting current user:', error);
      return null;
    }
  },

  /**
   * Get current session
   */
  async getSession() {
    const user = await this.getCurrentUser();
    const token = localStorage.getItem('auth_token');

    if (user && token) {
      return { user, session: { access_token: token } };
    }

    return { user: null, session: null };
  },
};

/**
 * Leads API utilities
 */
export const leadsApi = {
  /**
   * Fetch all leads
   */
  async getLeads() {
    return apiCall('/leads');
  },

  /**
   * Get a single lead
   */
  async getLead(id: string) {
    return apiCall(`/leads/${id}`);
  },

  /**
   * Create a lead
   */
  async createLead(data: any) {
    return apiCall('/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update a lead
   */
  async updateLead(id: string, data: any) {
    return apiCall(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a lead
   */
  async deleteLead(id: string) {
    return apiCall(`/leads/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Settings API utilities
 */
export const settingsApi = {
  /**
   * Get all settings
   */
  async getSettings() {
    return apiCall('/settings');
  },

  /**
   * Get a single setting
   */
  async getSetting(key: string) {
    return apiCall(`/settings/${key}`);
  },

  /**
   * Update a setting
   */
  async updateSetting(key: string, value: any) {
    return apiCall(`/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    });
  },
};

export default apiCall;
