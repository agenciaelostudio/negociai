import { NextResponse } from "next/server";

import {
  ACCESS_COOKIE,
  ACCESS_COOKIE_OPTIONS,
  createAccessToken,
  paymentsEnabled,
} from "@/lib/access";
import { isCheckoutPaidByRef } from "@/lib/asaas";
import { getServerSupabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Verifica se o pagamento foi confirmado no Asaas.
 *
 * Estratégia de fallback:
 * 1. Se receber `ref` → consulta Asaas pelo externalReference
 * 2. Se `ref` não informado mas usuário autenticado → busca checkouts
 *    pendentes no banco e consulta cada um no Asaas
 *
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

  let paid = false;
  let foundRef = ref;

  // --- TENTATIVA 1: pelo ref informado ---
  if (ref) {
    try {
      paid = await isCheckoutPaidByRef(process.env.ASAAS_API_KEY!, ref);
    } catch (err) {
      console.error("Falha ao consultar Asaas por ref:", err);
    }
  }

  // --- TENTATIVA 2: fallback por usuário autenticado ---
  if (!paid) {
    const authClient = await createClient();
    const user = authClient
      ? (await authClient.auth.getUser()).data.user
      : null;

    if (user) {
      const supabase = getServerSupabase();
      if (supabase) {
        try {
          // Busca checkouts pendentes do usuário (últimos 30 min)
          const trintaMinAtras = new Date(
            Date.now() - 30 * 60 * 1000,
          ).toISOString();
          const { data: checkouts } = await supabase
            .from("checkouts")
            .select("id, asaas_checkout_id")
            .or(`user_id.eq.${user.id},email.eq.${user.email}`)
            .eq("status", "pending")
            .gte("created_at", trintaMinAtras)
            .order("created_at", { ascending: false })
            .limit(5);

          if (checkouts && checkouts.length > 0) {
            for (const checkout of checkouts) {
              try {
                paid = await isCheckoutPaidByRef(
                  process.env.ASAAS_API_KEY!,
                  checkout.id,
                );
                if (paid) {
                  foundRef = checkout.id;
                  // Atualiza status no banco
                  await supabase
                    .from("checkouts")
                    .update({ status: "confirmed" })
                    .eq("id", checkout.id);
                  break;
                }
              } catch {
                continue;
              }
            }
          }
        } catch (err) {
          console.error("Falha no fallback de checkout:", err);
        }
      }
    }
  }

  if (!paid) {
    return NextResponse.json({ paid: false, ref: foundRef || null });
  }

  // --- PAGAMENTO CONFIRMADO: salva no banco e emite cookie ---
  const supabase = getServerSupabase();
  const authClient = await createClient();
  const userId = authClient
    ? (await authClient.auth.getUser()).data.user?.id
    : null;

  if (supabase) {
    try {
      await supabase.from("payments").insert({
        user_id: userId,
        plan: "negociai",
        amount: Number(process.env.NEXT_PUBLIC_PRICE_BRL || "19.90"),
        status: "confirmed",
      });
      if (userId) {
        await supabase
          .from("profiles")
          .upsert({ id: userId, has_paid: true });
      }
    } catch {
      /* não bloqueia */
    }
  }

  const res = NextResponse.json({ paid: true, ref: foundRef });
  res.cookies.set(ACCESS_COOKIE, createAccessToken(), ACCESS_COOKIE_OPTIONS);
  return res;
}