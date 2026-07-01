import { NextResponse } from "next/server";

import {
  ACCESS_COOKIE,
  ACCESS_COOKIE_OPTIONS,
  createAccessToken,
} from "@/lib/access";
import { getServerSupabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Admin-only: libera acesso de um usuário pelo email.
 * Chamado pelo suporte para casos em que o pagamento foi confirmado
 * manualmente mas a automação falhou (ex: antes da tabela checkouts existir).
 *
 * Segurança: exige um ADMIN_SECRET como query param ou header.
 */
export async function GET(req: Request) {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) {
    return NextResponse.json(
      { error: "ADMIN_SECRET não configurado no servidor." },
      { status: 503 },
    );
  }

  const providedSecret =
    req.headers.get("x-admin-secret") ||
    new URL(req.url).searchParams.get("secret");

  if (!providedSecret || providedSecret !== adminSecret) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const email =
    new URL(req.url).searchParams.get("email") || "davidrhangel@gmail.com";
  const userId =
    new URL(req.url).searchParams.get("user_id") ||
    "8c809d92-4663-4a67-bcd0-5edd330d2155";

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase não configurado." },
      { status: 503 },
    );
  }

  // Marca como pago (usa o user_id conhecido do David)
  await supabase.from("profiles").upsert({
    id: userId,
    email,
    has_paid: true,
  });

  // Registra pagamento manual
  await supabase.from("payments").insert({
    user_id: userId,
    plan: "negociai",
    amount: Number(process.env.NEXT_PUBLIC_PRICE_BRL || "19.90"),
    status: "confirmed",
  });

  return NextResponse.json({
    success: true,
    message: `Acesso liberado para ${email}`,
    userId,
  });
}