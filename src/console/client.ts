import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

// Publishable key only. Never use a service_role or sb_secret key in frontend code.
export const consoleConfigured = Boolean(url?.startsWith("https://") && publishableKey);
export const consoleClient = consoleConfigured
  ? createClient(url!, publishableKey!, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
  : null;
