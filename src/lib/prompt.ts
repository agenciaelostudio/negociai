import { CATALOGO } from "./catalog";
import type { FormData } from "./types";

export function buildPrompt(data: FormData): string {
  const atalhosLista = CATALOGO.map(
    (a) => `- ${a.atalho} (categoria: ${a.categoria}) → ${a.titulo}`,
  ).join("\n");

  return `Você é um especialista em negociação e vendas via WhatsApp.

Crie um sistema completo de respostas rápidas para WhatsApp Business, personalizado para o profissional abaixo.

INFORMAÇÕES DO USUÁRIO:
Nome: ${data.nome}
Profissão: ${data.profissao}
Serviços: ${data.servicos}
Faixa de preço: ${data.preco}
Diferenciais: ${data.diferenciais}
Objeções recebidas: ${data.objecoes}
Tom de comunicação: ${data.tom}

REGRAS:
- Escreva no tom "${data.tom}".
- Mensagens prontas para copiar e colar no WhatsApp, na primeira pessoa.
- Use quebras de linha curtas (estilo WhatsApp), sem markdown e sem emojis em excesso.
- Personalize com a profissão, serviços e diferenciais reais do usuário.
- Em objeções, conduza a conversa de volta para o fechamento, sem ser agressivo.
- NÃO invente preços fixos; use a faixa informada de forma natural quando fizer sentido.

GERE EXATAMENTE estes atalhos (mínimo 50 mensagens), mantendo o "atalho" e a "categoria" idênticos:
${atalhosLista}

FORMATO DE SAÍDA:
Retorne SOMENTE um JSON válido, sem texto antes ou depois, no formato:
{
  "mensagens": [
    {
      "categoria": "objecoes",
      "titulo": "Cliente achou caro",
      "atalho": "/caro",
      "mensagem": "Entendo perfeitamente..."
    }
  ]
}

As categorias válidas são: apresentacao, diferenciais, valores, info, objecoes, followup, fechamento, urgencia, posvenda.`;
}
