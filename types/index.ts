// Types for Express server
export interface AuthRequest extends Express.Request {
  userId?: string;
}

export interface LeadData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  profession?: string;
  message?: string;
  notes?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'archived';
}

export interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role?: string;
}

export interface SettingData {
  key: string;
  value: any;
  description?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
