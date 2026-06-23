import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

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
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("generation get:", error);
    return NextResponse.json(
      { error: "Erro ao buscar geração." },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Geração não encontrada." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    id: data.id,
    profession: data.profession,
    created_at: data.created_at,
    data: data.data,
    mensagens: data.generated_content,
  });
}