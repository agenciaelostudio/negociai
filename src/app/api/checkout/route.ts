import crypto from "crypto";
import { NextResponse } from "next/server";

import {
  ACCESS_COOKIE,
  ACCESS_COOKIE_OPTIONS,
  createAccessToken,
  paymentsEnabled,
} from "@/lib/access";
import { getAppUrl } from "@/lib/app-url";
import { asaasCheckoutUrl, createCheckout } from "@/lib/asaas";

export const runtime = "nodejs";

/**
 * Inicia o pagamento.
 * - Sem ASAAS_API_KEY (demo): libera o acesso e leva direto ao formulário.
 * - Com ASAAS_API_KEY: cria um Checkout no Asaas (PIX/cartão) e retorna a URL.
 */
export async function POST() {
  const appUrl = getAppUrl();
  const price = Number(process.env.NEXT_PUBLIC_PRICE_BRL || "19.90");

  if (!paymentsEnabled()) {
    const res = NextResponse.json({
      url: `${appUrl}/formulario`,
      simulated: true,
    });
    res.cookies.set(ACCESS_COOKIE, createAccessToken(), ACCESS_COOKIE_OPTIONS);
    return res;
  }

  try {
    const ref = crypto.randomUUID();
    const { id } = await createCheckout(process.env.ASAAS_API_KEY!, {
      value: price,
      externalReference: ref,
      successUrl: `${appUrl}/sucesso?ref=${ref}`,
      cancelUrl: `${appUrl}/`,
      expiredUrl: `${appUrl}/`,
    });

    return NextResponse.json({ url: asaasCheckoutUrl(id) });
  } catch (err) {
    console.error("Checkout falhou:", err);
    return NextResponse.json(
      { error: "Não foi possível iniciar o pagamento." },
      { status: 502 },
    );
  }
}
