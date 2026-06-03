import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import {
  ACCESS_COOKIE,
  paymentsEnabled,
  verifyAccessToken,
} from "@/lib/access";
import { gerarFallback } from "@/lib/fallback";
import { gerarComOpenAI, hasOpenAI } from "@/lib/openai";
import { getServerSupabase } from "@/lib/supabase";
import type { FormData, GenerateResponse, Mensagem, Tom } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const TONS: Tom[] = ["Formal", "Profissional", "Amigável", "Premium"];

function parseForm(body: unknown): FormData {
  const b = (body ?? {}) as Record<string, unknown>;
  const tom = TONS.includes(b.tom as Tom) ? (b.tom as Tom) : "Profissional";
  return {
    nome: String(b.nome ?? "").slice(0, 120),
    profissao: String(b.profissao ?? "").slice(0, 120),
    servicos: String(b.servicos ?? "").slice(0, 600),
    preco: String(b.preco ?? "").slice(0, 120),
    diferenciais: String(b.diferenciais ?? "").slice(0, 600),
    objecoes: String(b.objecoes ?? "").slice(0, 600),
    tom,
  };
}

async function persist(form: FormData, mensagens: Mensagem[]) {
  const supabase = getServerSupabase();
  if (!supabase) return;
  try {
    await supabase.from("generations").insert({
      profession: form.profissao,
      data: form,
      generated_content: mensagens,
    });
  } catch {
    // não bloqueia a resposta se o banco falhar
  }
}

export async function POST(req: Request) {
  // Gating de pagamento: só exige acesso quando o pagamento está habilitado.
  if (paymentsEnabled()) {
    const token = (await cookies()).get(ACCESS_COOKIE)?.value;
    if (!verifyAccessToken(token)) {
      return NextResponse.json(
        { error: "Pagamento necessário.", code: "PAYMENT_REQUIRED" },
        { status: 402 },
      );
    }
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const form = parseForm(body);

  if (!form.nome.trim() || !form.profissao.trim()) {
    return NextResponse.json(
      { error: "Nome e profissão são obrigatórios." },
      { status: 400 },
    );
  }

  let mensagens: Mensagem[] = [];
  let source: GenerateResponse["source"] = "fallback";

  if (hasOpenAI()) {
    try {
      mensagens = await gerarComOpenAI(form);
      source = "openai";
    } catch (err) {
      console.error("OpenAI falhou, usando fallback:", err);
    }
  }

  // Fallback se a IA não rodou ou retornou pouco conteúdo.
  if (mensagens.length < 20) {
    mensagens = gerarFallback(form);
    source = "fallback";
  }

  await persist(form, mensagens);

  const response: GenerateResponse = { mensagens, source };
  return NextResponse.json(response);
}
