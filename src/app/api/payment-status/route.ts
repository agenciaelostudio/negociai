import { NextResponse } from "next/server";

import {
  ACCESS_COOKIE,
  ACCESS_COOKIE_OPTIONS,
  createAccessToken,
  paymentsEnabled,
} from "@/lib/access";
import { isCheckoutPaidByRef } from "@/lib/asaas";
import { getServerSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * Verifica se o pagamento foi confirmado no Asaas.
 * Quando confirmado, emite o cookie de acesso (HMAC) que destrava o gerador.
 */
export async function GET(req: Request) {
  // Modo demo: sem pagamento configurado, libera direto.
  if (!paymentsEnabled()) {
    const res = NextResponse.json({ paid: true, simulated: true });
    res.cookies.set(ACCESS_COOKIE, createAccessToken(), ACCESS_COOKIE_OPTIONS);
    return res;
  }

  const ref = new URL(req.url).searchParams.get("ref");
  if (!ref) {
    return NextResponse.json({ paid: false, error: "ref ausente" }, { status: 400 });
  }

  let paid = false;
  try {
    paid = await isCheckoutPaidByRef(process.env.ASAAS_API_KEY!, ref);
  } catch (err) {
    console.error("Falha ao consultar Asaas:", err);
    return NextResponse.json({ paid: false }, { status: 502 });
  }

  if (!paid) {
    return NextResponse.json({ paid: false });
  }

  // Registra o pagamento (se Supabase estiver configurado).
  const supabase = getServerSupabase();
  if (supabase) {
    try {
      await supabase.from("payments").insert({
        plan: "negociai",
        amount: Number(process.env.NEXT_PUBLIC_PRICE_BRL || "19.90"),
        status: "confirmed",
      });
    } catch {
      /* não bloqueia */
    }
  }

  const res = NextResponse.json({ paid: true });
  res.cookies.set(ACCESS_COOKIE, createAccessToken(), ACCESS_COOKIE_OPTIONS);
  return res;
}
