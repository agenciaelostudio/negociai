import OpenAI from "openai";
import { buildPrompt } from "./prompt";
import { CATALOGO } from "./catalog";
import type { Categoria, FormData, Mensagem } from "./types";
import { CATEGORIAS } from "./types";

const VALID_CATEGORIAS = new Set<string>(CATEGORIAS);

export function hasOpenAI(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

function coerceMensagens(raw: unknown): Mensagem[] {
  const arr = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as { mensagens?: unknown[] })?.mensagens)
      ? (raw as { mensagens: unknown[] }).mensagens
      : [];

  const out: Mensagem[] = [];
  for (const item of arr) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const categoria = String(o.categoria ?? "").trim();
    const titulo = String(o.titulo ?? "").trim();
    const atalho = String(o.atalho ?? "").trim();
    const mensagem = String(o.mensagem ?? "").trim();
    if (!atalho || !mensagem) continue;
    if (!VALID_CATEGORIAS.has(categoria)) continue;
    out.push({
      categoria: categoria as Categoria,
      titulo: titulo || atalho,
      atalho: atalho.startsWith("/") ? atalho : `/${atalho}`,
      mensagem,
    });
  }
  return out;
}

/**
 * Chama a OpenAI e retorna as mensagens. Garante que todos os atalhos do
 * catálogo estejam presentes (a IA às vezes esquece alguns).
 */
export async function gerarComOpenAI(data: FormData): Promise<Mensagem[]> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.8,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Você é um especialista em negociação e copywriting para WhatsApp. Responde SEMPRE com JSON válido.",
      },
      { role: "user", content: buildPrompt(data) },
    ],
  });

  const content = completion.choices[0]?.message?.content ?? "{}";
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = {};
  }

  const mensagens = coerceMensagens(parsed);
  const byAtalho = new Map(mensagens.map((m) => [m.atalho, m]));

  // Mantém a ordem do catálogo e preenche o que faltar.
  const completas = CATALOGO.map((spec) => byAtalho.get(spec.atalho)).filter(
    (m): m is Mensagem => Boolean(m),
  );

  // Inclui também mensagens extras que a IA tenha criado fora do catálogo.
  const extras = mensagens.filter(
    (m) => !CATALOGO.some((c) => c.atalho === m.atalho),
  );

  return [...completas, ...extras];
}
