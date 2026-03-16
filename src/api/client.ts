import { supabase } from './supabase'; 

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 
  `https://${process.env.EXPO_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-b55216b3`;

const FUNCTION_MODE = (process.env.EXPO_PUBLIC_FUNCTION_MODE || 'gateway').toString();

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

class FrontendApiClient {
  private async request<T>(
    endpoint: string,
    options: {
      method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
      body?: any;
      accessToken?: string;
    } = {}
  ): Promise<ApiResponse<T>> {
    const { method = "GET", body, accessToken } = options;

    const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
    let authSource = 'anon';
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${anonKey}`,
      "apikey": anonKey,
      "x-auth-source": authSource,
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
      authSource = 'prop';
      headers['x-auth-source'] = authSource;
    } else {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const sessionToken = session?.access_token;
        if (sessionToken) {
          headers["Authorization"] = `Bearer ${sessionToken}`;
          authSource = 'session';
          headers['x-auth-source'] = authSource;
        }
      } catch (e) {
        console.warn('Session check failed', e);
      }
    }

    try {
      const base = BACKEND_URL.replace(/\/$/, '');
      const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      let fetchUrl = `${base}${path}`;

      if (FUNCTION_MODE === 'direct') {
        const singleSegment = path.match(/^\/([a-z0-9\-]+)$/i);
        if (singleSegment) {
          const fnName = singleSegment[1];
          fetchUrl = `https://${process.env.EXPO_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/${fnName}`;
        }
      }

      const response = await fetch(fetchUrl, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      let parsed: any = null;
      try {
        parsed = await response.json();
      } catch (jsonErr) {
        const text = await response.text().catch(() => '<<unable to read body>>');
        parsed = { error: `Non-JSON response (HTTP ${response.status})`, raw: text };
      }

      if (!response.ok) {
        // Fallback for direct Supabase queries if Edge Function fails
        if (endpoint.startsWith('/observations/') && method === 'GET') {
           try {
            const obsId = endpoint.split('/')[2];
            if (obsId) {
              const { data, error } = await supabase
                .from('observations')
                .select(`*, lepidoptera:lepidoptera_taxonomy(*), plant:plant_taxonomy(*)`)
                .eq('id', obsId)
                .single();
              if (error) throw error;
              return { success: true, data: data as any }; 
            }
           } catch (fallbackErr) {
             console.warn('API client: observation fallback failed:', fallbackErr);
           }
        }

        return {
          success: false,
          error: parsed?.error || parsed?.message || `HTTP ${response.status}`,
          statusCode: response.status,
        };
      }

      return {
        success: true,
        data: parsed?.data ?? parsed,
        message: parsed?.message,
      };
    } catch (error: any) {
       return {
        success: false,
        error: error.message || "Network error",
        statusCode: 0,
      };
    }
  }

  async get<T>(endpoint: string, accessToken?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET", accessToken });
  }

  async post<T>(endpoint: string, body: any, accessToken?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "POST", body, accessToken });
  }

  async put<T>(endpoint: string, body: any, accessToken?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "PUT", body, accessToken });
  }

  async delete<T>(endpoint: string, accessToken?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE", accessToken });
  }

  // --- FALLBACK METHODS ---
  
  async getObservations(): Promise<ApiResponse> {
    try {
      // NOTE: Added !user_id to explicitly tell Supabase how to map profiles
      const { data, error } = await supabase
        .from('observations')
        .select(`*, profiles!user_id ( name, avatar_url, username ), lepidoptera_taxonomy ( * ), plant_taxonomy ( * )`)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) return { success: false, error: error.message };
      return { success: true, data: data || [] };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to fetch observations' };
    }
  }

  async searchSpecies(query: string, type: 'lepidoptera' | 'plant'): Promise<ApiResponse> {
    try {
      const table = type === 'lepidoptera' ? 'lepidoptera_taxonomy' : 'plant_taxonomy';
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .ilike('common_name', `%${query}%`)
        .limit(20);
        
      if (error) return { success: false, error: error.message };
      return { success: true, data: data || [] };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to search species' };
    }
  }

  // NOTE: This was missing previously!
  async getProfile(userId: string): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error) return { success: false, error: error.message };
      return { success: true, data: data || {} };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to fetch profile' };
    }
  }
}

export const apiClient = new FrontendApiClient();