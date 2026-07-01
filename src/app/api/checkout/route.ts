import crypto from "crypto";
import { NextResponse } from "next/server";

import {
  ACCESS_COOKIE,
  ACCESS_COOKIE_OPTIONS,
  createAccessToken,
  paymentsEnabled,
} from "@/lib/access";
import { getAppUrl } from "@/lib/app-url";
import {
  asaasApiBase,
  asaasCheckoutUrl,
  asaasIsProduction,
  createCheckout,
  parsePriceBrl,
} from "@/lib/asaas";
import { getServerSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * Inicia o pagamento.
 * O email é enviado pelo cliente (BuyButton) porque em alguns casos
 * o Supabase SSR não consegue recuperar a sessão do servidor (PKCE bug).
 */
export async function POST(req: Request) {
  const appUrl = getAppUrl();
  const price = parsePriceBrl(process.env.NEXT_PUBLIC_PRICE_BRL);

  if (!paymentsEnabled()) {
    const res = NextResponse.json({
      url: `${appUrl}/painel`,
      simulated: true,
    });
    res.cookies.set(ACCESS_COOKIE, createAccessToken(), ACCESS_COOKIE_OPTIONS);
    return res;
  }

  // Email enviado pelo cliente (BuyButton) — fonte de verdade da identidade
  let email = "";
  try {
    const body = await req.json();
    email = String(body?.email || "").trim().toLowerCase();
  } catch {
    // corpo vazio ou inválido
  }

  try {
    const ref = crypto.randomUUID();
    const { id, link } = await createCheckout(process.env.ASAAS_API_KEY!, {
      value: price,
      externalReference: ref,
      successUrl: `${appUrl}/sucesso?ref=${ref}`,
      cancelUrl: `${appUrl}/painel`,
      expiredUrl: `${appUrl}/painel`,
    });

    // Salva o checkout no banco com o email (fallback principal)
    const supabase = getServerSupabase();
    if (supabase && email) {
      try {
        await supabase.from("checkouts").upsert({
          id: ref,
          email,
          user_id: null, // será preenchido depois se a sessão for recuperada
          asaas_checkout_id: id,
          status: "pending",
          created_at: new Date().toISOString(),
        });
      } catch {
        // não bloqueia
      }
    }

    return NextResponse.json({ url: link || asaasCheckoutUrl(id) });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "";
    const key = process.env.ASAAS_API_KEY || "";
    console.error("Checkout falhou:", err);
    return NextResponse.json(
      {
        error: "Não foi possível iniciar o pagamento.",
        detail: detail || undefined,
        hint:
          detail.includes("não pertence a este ambiente")
            ? "Recrie a chave no Asaas e cole de novo em ASAAS_API_KEY na Vercel (sem aspas nem espaços). O ambiente é detectado pelo prefixo _prod_ ou _hmlg_ na chave."
            : undefined,
        debug: {
          asaasBase: asaasApiBase(),
          detectedEnv: asaasIsProduction() ? "production" : "sandbox",
          keyLooksProd: key.includes("_prod_"),
          keyLooksSandbox: key.includes("_hmlg_"),
          keyStartsWithAact: key.trim().startsWith("$aact"),
          keyLength: key.trim().length,
        },
      },
      { status: 502 },
    );
  }
}