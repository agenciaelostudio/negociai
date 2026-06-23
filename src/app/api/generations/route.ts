import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Autenticação não configurada." },
      { status: 503 },
    );
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const admin = getServerSupabase();
  if (!admin) {
    return NextResponse.json(
      { error: "Banco de dados não configurado." },
      { status: 503 },
    );
  }

  const { data, error } = await admin
    .from("generations")
    .select("id, profession, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("generations list:", error);
    return NextResponse.json(
      { error: "Erro ao buscar histórico." },
      { status: 500 },
    );
  }

  return NextResponse.json({ generations: data ?? [] });
}