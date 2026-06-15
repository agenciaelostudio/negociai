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

export const runtime = "nodejs";

/**
 * Inicia o pagamento.
 * - Sem ASAAS_API_KEY (demo): libera o acesso e leva direto ao formulário.
 * - Com ASAAS_API_KEY: cria um Checkout no Asaas (PIX/cartão) e retorna a URL.
 */
export async function POST() {
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

  try {
    const ref = crypto.randomUUID();
    const { id, link } = await createCheckout(process.env.ASAAS_API_KEY!, {
      value: price,
      externalReference: ref,
      successUrl: `${appUrl}/sucesso?ref=${ref}`,
      cancelUrl: `${appUrl}/painel`,
      expiredUrl: `${appUrl}/painel`,
    });

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
