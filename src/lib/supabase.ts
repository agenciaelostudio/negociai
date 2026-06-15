import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function cleanEnvVar(val: string | undefined): string {
  if (!val) return "";
  return val.replace(/\uFEFF/g, "").trim();
}

/**
 * Cliente Supabase para uso no servidor (API routes).
 * Retorna null se as variáveis de ambiente não estiverem configuradas,
 * permitindo que o app funcione sem banco de dados durante o desenvolvimento.
 */
export function getServerSupabase(): SupabaseClient | null {
  const url = cleanEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = cleanEnvVar(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
