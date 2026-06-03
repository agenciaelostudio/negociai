export type Tom = "Formal" | "Profissional" | "Amigável" | "Premium";

export const CATEGORIAS = [
  "apresentacao",
  "diferenciais",
  "valores",
  "info",
  "objecoes",
  "followup",
  "fechamento",
  "urgencia",
  "posvenda",
] as const;

export type Categoria = (typeof CATEGORIAS)[number];

export interface FormData {
  nome: string;
  profissao: string;
  servicos: string;
  preco: string;
  diferenciais: string;
  objecoes: string;
  tom: Tom;
}

export interface Mensagem {
  categoria: Categoria;
  titulo: string;
  atalho: string;
  mensagem: string;
}

export interface GenerateResponse {
  mensagens: Mensagem[];
  source: "openai" | "fallback";
}

export const CATEGORIA_LABELS: Record<Categoria, string> = {
  apresentacao: "Apresentação",
  diferenciais: "Diferenciais",
  valores: "Valores",
  info: "Pedido de Informações",
  objecoes: "Quebra de Objeções",
  followup: "Follow-up",
  fechamento: "Fechamento",
  urgencia: "Urgência",
  posvenda: "Pós-venda",
};

export const CATEGORIA_ORDER: Categoria[] = [...CATEGORIAS];
