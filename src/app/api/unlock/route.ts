import { NextResponse } from "next/server";

import {
  ACCESS_COOKIE,
  ACCESS_COOKIE_OPTIONS,
  createAccessToken,
} from "@/lib/access";
import { isCheckoutPaidByRef } from "@/lib/asaas";
import { getServerSupabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Re-verifica pagamentos pendentes do usuário no Asaas e libera acesso
 * se encontrar um pagamento confirmado.
 *
 * NÃO libera sem verificar no Asaas — segurança primeiro.
 */
export async function POST() {
  try {
    const authClient = await createClient();
    if (!authClient) {
      return NextResponse.json(
        { error: "Autenticação não disponível." },
        { status: 503 },
      );
    }

    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Usuário não autenticado." },
        { status: 401 },
      );
    }

    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json(
        { error: "Banco de dados não disponível." },
        { status: 503 },
      );
    }

    // Busca checkouts pendentes do usuário (últimos 30 min)
    const trintaMinAtras = new Date(
      Date.now() - 30 * 60 * 1000,
    ).toISOString();
    const { data: checkouts } = await supabase
      .from("checkouts")
      .select("id, asaas_checkout_id")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .gte("created_at", trintaMinAtras)
      .order("created_at", { ascending: false })
      .limit(5);

    if (!checkouts || checkouts.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Nenhum pagamento pendente encontrado. Faça o pagamento primeiro.",
        code: "NO_PENDING_PAYMENT",
      });
    }

    // Verifica cada checkout no Asaas
    let paid = false;
    let paidRef = "";
    for (const checkout of checkouts) {
      try {
        paid = await isCheckoutPaidByRef(
          process.env.ASAAS_API_KEY!,
          checkout.id,
        );
        if (paid) {
          paidRef = checkout.id;
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

    if (!paid) {
      return NextResponse.json({
        success: false,
        error: "Pagamento ainda não identificado no Asaas. Se você pagou via PIX, pode levar alguns minutos. Tente novamente daqui a pouco.",
        code: "PAYMENT_NOT_FOUND",
      });
    }

    // PAGAMENTO CONFIRMADO: registra e libera
    await supabase.from("payments").insert({
      user_id: user.id,
      plan: "negociai",
      amount: Number(process.env.NEXT_PUBLIC_PRICE_BRL || "19.90"),
      status: "confirmed",
    });

    const { error: updateError } = await supabase
      .from("profiles")
      .upsert({ id: user.id, has_paid: true });

    if (updateError) {
      console.error("Erro ao marcar como pago:", updateError);
      return NextResponse.json(
        { error: "Erro ao liberar acesso." },
        { status: 500 },
      );
    }

    const res = NextResponse.json({
      success: true,
      message: "Acesso liberado! Redirecionando...",
    });
    res.cookies.set(ACCESS_COOKIE, createAccessToken(), ACCESS_COOKIE_OPTIONS);
    return res;
  } catch (err) {
    console.error("Erro no unlock:", err);
    return NextResponse.json(
      { error: "Erro interno." },
      { status: 500 },
    );
  }
}