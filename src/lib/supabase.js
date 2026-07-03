import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase =
  hasSupabaseConfig && supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export async function signInWithEmail(email, password) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signInWithGoogle(redirectTo = typeof window !== 'undefined' ? window.location.href : undefined) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: redirectTo ? { redirectTo } : undefined,
  });
}

export async function signOut() {
  if (!supabase) {
    return;
  }

  await supabase.auth.signOut();
}