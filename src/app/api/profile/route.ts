import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import {
  paymentsEnabled,
  ACCESS_COOKIE,
  verifyAccessToken,
} from "@/lib/access";
import {
  EMPTY_PROFILE,
  profileFromRow,
  profileToRow,
} from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { getServerSupabase } from "@/lib/supabase";
import type { FormData } from "@/lib/types";

export const runtime = "nodejs";

async function getAuthUser() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}

async function ensureProfile(userId: string, email?: string | null) {
  const admin = getServerSupabase();
  if (!admin) return null;

  const { data } = await admin
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (data) return data;

  const { data: created, error } = await admin
    .from("profiles")
    .insert({ id: userId, email: email ?? null })
    .select("*")
    .single();

  if (error) {
    console.error("ensureProfile:", error);
    return null;
  }
  return created;
}

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const cookieStore = await cookies();
  const hasAccessCookie = verifyAccessToken(
    cookieStore.get(ACCESS_COOKIE)?.value,
  );

  const admin = getServerSupabase();
  if (!admin) {
    return NextResponse.json(
      { error: "Banco de dados não configurado." },
      { status: 503 },
    );
  }

  const row = await ensureProfile(user.id, user.email);
  const profile = row
    ? profileFromRow(row)
    : { ...EMPTY_PROFILE, email: user.email ?? undefined };

  if (!paymentsEnabled()) {
    profile.hasPaid = true;
  } else if (hasAccessCookie || profile.hasPaid) {
    profile.hasPaid = true;
  }

  return NextResponse.json({ profile, authenticated: true });
}

export async function PUT(req: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const admin = getServerSupabase();
  if (!admin) {
    return NextResponse.json(
      { error: "Banco de dados não configurado." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const b = (body ?? {}) as Partial<FormData>;
  const form: FormData = {
    nome: String(b.nome ?? "").slice(0, 120),
    profissao: String(b.profissao ?? "").slice(0, 120),
    servicos: String(b.servicos ?? "").slice(0, 600),
    preco: String(b.preco ?? "").slice(0, 120),
    diferenciais: String(b.diferenciais ?? "").slice(0, 600),
    objecoes: String(b.objecoes ?? "").slice(0, 600),
    tom: (["Formal", "Profissional", "Amigável", "Premium"].includes(
      String(b.tom),
    )
      ? b.tom
      : "Profissional") as FormData["tom"],
  };

  await ensureProfile(user.id, user.email);

  const row = profileToRow(form, user.email ?? undefined);
  const { error } = await admin.from("profiles").upsert({
    id: user.id,
    ...row,
  });

  if (error) {
    console.error("profile save:", error);
    return NextResponse.json({ error: "Falha ao salvar" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
