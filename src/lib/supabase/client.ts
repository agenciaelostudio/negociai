import { createBrowserClient } from "@supabase/ssr";

export function cleanEnvVar(val: string | undefined): string {
  if (!val) return "";
  return val.replace(/\uFEFF/g, "").trim();
}

export function isAuthEnabled(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function createClient() {
  const url = cleanEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = cleanEnvVar(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return createBrowserClient(url, key);
}
