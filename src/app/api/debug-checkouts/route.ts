import { NextResponse } from "next/server";

export const runtime = "nodejs";

function cleanKey(key: string): string {
  return key.replace(/^[\uFEFF"']|["']$/g, "").trim();
}

/**
 * Debug: testa diferentes endpoints do Asaas para encontrar checkouts.
 */
export async function GET() {
  const key = cleanKey(process.env.ASAAS_API_KEY || "");
  if (!key) return NextResponse.json({ error: "ASAAS_API_KEY não configurada" });

  const env = key.includes("_prod_") ? "production" : "sandbox";
  const base = env === "production"
    ? "https://api.asaas.com/v3"
    : "https://api-sandbox.asaas.com/v3";

  const headers = { access_token: key, "Content-Type": "application/json" };

  const testEndpoints = [
    `${base}/checkouts?limit=1`,
    `${base}/checkoutSessions?limit=1`,
    `${base}/payments?limit=1`,
    `${base}/customers?limit=1`,
  ];

  const results: Record<string, any> = { env, base };

  for (const url of testEndpoints) {
    try {
      const res = await fetch(url, { headers });
      const text = await res.text();
      let data: any;
      try { data = JSON.parse(text); } catch { data = { raw: text.slice(0, 500) }; }

      const name = url.replace(base, "");
      results[name] = {
        status: res.status,
        ok: res.ok,
        hasData: Array.isArray(data?.data),
        count: Array.isArray(data?.data) ? data.data.length : "N/A",
        fields: Array.isArray(data?.data) && data.data.length > 0 ? Object.keys(data.data[0]) : [],
        sample: Array.isArray(data?.data) && data.data.length > 0 ? data.data[0] : null,
        error: data.errors || data.error || null,
      };
    } catch (err) {
      results[url.replace(base, "")] = { error: String(err) };
    }
  }

  return NextResponse.json(results);
}