import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { isAuthEnabled, cleanEnvVar } from "@/lib/supabase/client";

export async function createClient() {
  if (!isAuthEnabled()) return null;

  const cookieStore = await cookies();

  const url = cleanEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = cleanEnvVar(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            /* chamado de Server Component */
          }
        },
      },
    },
  );
}
