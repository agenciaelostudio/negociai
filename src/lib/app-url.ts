/**
 * URL pública do app (callbacks do Asaas, redirects, cookies).
 * Na Vercel, usa VERCEL_URL automaticamente se NEXT_PUBLIC_APP_URL não estiver definida.
 */
export function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}
