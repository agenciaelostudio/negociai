import { buildPrompt } from "./prompt";
import { CATALOGO } from "./catalog";
import type { Categoria, FormData, Mensagem } from "./types";
import { CATEGORIAS } from "./types";

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL_QUALIDADE = "llama-3.3-70b-versatile";
const GROQ_MODEL_RAPIDO = "llama-3.1-8b-instant";

const VALID_CATEGORIAS = new Set<string>(CATEGORIAS);

export function hasGroq(): boolean {
  return Boolean(process.env.GROQ_API_KEY);
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
 * Chama a Groq e retorna as mensagens.
 * Usa o modelo 70B (qualidade) pra gerar os 53 scripts personalizados.
 */
export async function gerarComGroq(formData: FormData): Promise<Mensagem[]> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY nao configurada");
  }

  const prompt = buildPrompt(formData);

  const response = await fetch(GROQ_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL_QUALIDADE,
      messages: [
        {
          role: "system",
          content:
            "Voce e um especialista em negociacao e copywriting para WhatsApp. Responde SEMPRE com JSON valido.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`[Groq] HTTP ${response.status}:`, text.slice(0, 200));
    throw new Error(`Groq HTTP ${response.status}`);
  }

  const json = await response.json();
  const content = json.choices?.[0]?.message?.content ?? "{}";

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = {};
  }

  const mensagens = coerceMensagens(parsed);
  const byAtalho = new Map(mensagens.map((m) => [m.atalho, m]));

  // Mantem a ordem do catalogo e preenche o que faltar
  const completas = CATALOGO.map((spec) => byAtalho.get(spec.atalho)).filter(
    (m): m is Mensagem => Boolean(m),
  );

  // Inclui tambem mensagens extras que a IA tenha criado fora do catalogo
  const extras = mensagens.filter(
    (m) => !CATALOGO.some((c) => c.atalho === m.atalho),
  );

  return [...completas, ...extras];
}