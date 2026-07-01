import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * One-time setup: cria a tabela checkouts se não existir.
 * Pode ser removido após rodar uma vez.
 */
export async function GET() {
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase não configurado" }, { status: 503 });
  }

  const sql = `
    create table if not exists public.checkouts (
      id text primary key,
      user_id uuid,
      asaas_checkout_id text,
      status text not null default 'pending',
      created_at timestamptz not null default now()
    );
    create index if not exists checkouts_user_id_idx on public.checkouts (user_id);
    create index if not exists checkouts_status_idx on public.checkouts (status);
  `;

  try {
    const { error } = await supabase.rpc("exec_sql", { query: sql });
    if (error) {
      // Tenta via REST query direta
      const { error: e2 } = await supabase.from("checkouts").select("id").limit(1);
      if (e2 && e2.message?.includes("does not exist")) {
        return NextResponse.json({
          error: "Tabela não existe e não foi possível criar automaticamente.",
          hint: "Execute o SQL manualmente no Supabase Dashboard: https://supabase.com/dashboard/project/mxnkqrgakqpddtmtagnb/sql/new",
          sql,
        }, { status: 500 });
      }
    }
    return NextResponse.json({ ok: true, message: "Tabela checkouts pronta." });
  } catch (err) {
    return NextResponse.json({
      error: String(err),
      hint: "Execute o SQL manualmente no Supabase Dashboard",
      sql,
    }, { status: 500 });
  }
}
