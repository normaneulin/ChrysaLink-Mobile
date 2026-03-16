import { supabase } from '../api/supabase';
import * as Linking from 'expo-linking';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  username?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: any;
  error?: string;
}

class AuthService {
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const { data, error, count } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('email', email);

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('RLS policy issue - cannot read profiles table');
        }
        return false;
      }
      return (count ?? 0) > 0;
    } catch (error: any) {
      return false;
    }
  }

  async checkUsernameExists(username: string): Promise<boolean> {
    try {
      const { data, error, count } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('username', username);

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('RLS policy issue - cannot read profiles table');
        }
        return false;
      }
      return (count ?? 0) > 0;
    } catch (error: any) {
      return false;
    }
  }

  async validateSignUp(data: SignUpData): Promise<{ emailExists: boolean; usernameExists: boolean }> {
    const [emailExists, usernameExists] = await Promise.all([
      this.checkEmailExists(data.email),
      data.username ? this.checkUsernameExists(data.username) : Promise.resolve(false),
    ]);
    return { emailExists, usernameExists };
  }

  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      // Create a deep link back to the mobile app
      const redirectUri = Linking.createURL('/');

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUri,
          data: {
            username: data.username,
          },
        },
      });

      if (error) {
        if (error.message?.toLowerCase().includes('rate limit')) {
          return { accessToken: '', user: null, error: error.message };
        }
        return { accessToken: '', user: null, error: error.message };
      }

      return {
        accessToken: authData.session?.access_token || '',
        refreshToken: authData.session?.refresh_token,
        user: authData.user,
        error: undefined,
      };
    } catch (error: any) {
      return { accessToken: '', user: null, error: error.message || 'Sign up failed' };
    }
  }

  async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      await supabase.auth.signOut();
      
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) return { accessToken: '', user: null, error: error.message };

      return {
        accessToken: authData.session?.access_token || '',
        refreshToken: authData.session?.refresh_token,
        user: authData.user,
        error: undefined,
      };
    } catch (error: any) {
      return { accessToken: '', user: null, error: error.message || 'Sign in failed' };
    }
  }

  async signInWithGoogle(): Promise<void> {
    try {
      const redirectUri = Linking.createURL('/');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
        },
      });

      if (error) throw new Error(error.message);
    } catch (error: any) {
      throw new Error(error.message || 'Google sign in failed');
    }
  }

  async signOut(): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) return { error: error.message };
      return {};
    } catch (error: any) {
      return { error: error.message || 'Sign out failed' };
    }
  }

  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        return { ...user, ...profile };
      }
      return null;
    } catch (error: any) {
      console.error('Failed to get current user:', error.message);
      return null;
    }
  }
}

export const authService = new AuthService();