import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Debug: mostra os últimos checkouts do Asaas para depuração.
 */
export async function GET() {
  const key = process.env.ASAAS_API_KEY || "";
  if (!key) {
    return NextResponse.json({ error: "ASAAS_API_KEY não configurada" });
  }

  const env = key.includes("_prod_") ? "production" : "sandbox";
  const base = env === "production"
    ? "https://api.asaas.com/v3"
    : "https://api-sandbox.asaas.com/v3";

  const since = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();

  try {
    const res = await fetch(
      `${base}/checkouts?limit=5&dateCreated[ge]=${encodeURIComponent(since)}`,
      {
        headers: {
          access_token: key.replace(/^[\uFEFF"']|["']$/g, "").trim(),
          "Content-Type": "application/json",
        },
      },
    );

    const text = await res.text();
    let data: any;
    try { data = JSON.parse(text); } catch { data = { rawText: text.slice(0, 1000) }; }

    // Mostra a estrutura do primeiro checkout pago (se houver)
    const list = Array.isArray(data.data) ? data.data : [];
    const paid = list.filter((c: any) =>
      ["PAID", "RECEIVED", "CONFIRMED"].includes(c?.status?.toUpperCase?.())
    );

    return NextResponse.json({
      status: res.status,
      env,
      totalCheckouts: list.length,
      totalPaid: paid.length,
      fieldsDisponiveis: list.length > 0 ? Object.keys(list[0]) : [],
      primeiroCheckout: list[0] || null,
      primeiroPago: paid[0] || null,
      raw: data,
    });
  } catch (err) {
    return NextResponse.json({
      error: String(err),
      env,
      base,
    });
  }
}