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
 * Endpoint para o próprio usuário solicitar liberação manual de acesso
 * quando o pagamento já foi feito mas a confirmação automática falhou.
 */
export async function POST(req: Request) {
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

    const admin = getServerSupabase();
    if (!admin) {
      return NextResponse.json(
        { error: "Banco de dados não disponível." },
        { status: 503 },
      );
    }

    // Marca o usuário como pago
    const { error: updateError } = await admin
      .from("profiles")
      .upsert({ id: user.id, has_paid: true });

    if (updateError) {
      console.error("Erro ao marcar como pago:", updateError);
      return NextResponse.json(
        { error: "Erro ao liberar acesso." },
        { status: 500 },
      );
    }

    // Emite o cookie de acesso
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
