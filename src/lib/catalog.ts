import type { Categoria } from "./types";

export interface AtalhoSpec {
  categoria: Categoria;
  atalho: string;
  titulo: string;
}

/**
 * Catálogo base de atalhos que o sistema deve sempre gerar.
 * Garante consistência mesmo quando a IA varia a saída.
 */
export const CATALOGO: AtalhoSpec[] = [
  // Apresentação
  { categoria: "apresentacao", atalho: "/apresentacao", titulo: "Apresentação profissional" },
  { categoria: "apresentacao", atalho: "/boasvindas", titulo: "Boas-vindas ao primeiro contato" },

  // Diferenciais
  { categoria: "diferenciais", atalho: "/diferencial", titulo: "Meus diferenciais" },
  { categoria: "diferenciais", atalho: "/porquemim", titulo: "Por que escolher meu trabalho" },

  // Valores
  { categoria: "valores", atalho: "/valores", titulo: "Apresentação de valores" },
  { categoria: "valores", atalho: "/pacotes", titulo: "Pacotes e opções" },

  // Pedido de informações
  { categoria: "info", atalho: "/info", titulo: "Pedido de informações" },
  { categoria: "info", atalho: "/agendar", titulo: "Coletar dados para agendar" },
  { categoria: "info", atalho: "/formaspagamento", titulo: "Formas de pagamento" },

  // Objeções
  { categoria: "objecoes", atalho: "/caro", titulo: "Cliente achou caro" },
  { categoria: "objecoes", atalho: "/desconto", titulo: "Cliente pede desconto" },
  { categoria: "objecoes", atalho: "/pensar", titulo: "Cliente vai pensar" },
  { categoria: "objecoes", atalho: "/esposa", titulo: "Vai falar com esposa/marido" },
  { categoria: "objecoes", atalho: "/pesquisar", titulo: "Cliente quer pesquisar" },
  { categoria: "objecoes", atalho: "/orcamento", titulo: "Pedido de orçamento" },
  { categoria: "objecoes", atalho: "/comparando", titulo: "Cliente está comparando" },
  { categoria: "objecoes", atalho: "/semdinheiro", titulo: "Cliente sem dinheiro agora" },

  // Follow-up
  { categoria: "followup", atalho: "/fup1", titulo: "Follow-up 1 dia" },
  { categoria: "followup", atalho: "/fup3", titulo: "Follow-up 3 dias" },
  { categoria: "followup", atalho: "/fup7", titulo: "Follow-up 7 dias" },
  { categoria: "followup", atalho: "/fup15", titulo: "Follow-up 15 dias" },

  // Fechamento
  { categoria: "fechamento", atalho: "/fechar", titulo: "Chamada para fechar" },
  { categoria: "fechamento", atalho: "/reserva", titulo: "Reserva de data/vaga" },
  { categoria: "fechamento", atalho: "/contrato", titulo: "Envio de contrato" },
  { categoria: "fechamento", atalho: "/pagamento", titulo: "Instruções de pagamento" },

  // Urgência
  { categoria: "urgencia", atalho: "/urgencia", titulo: "Gatilho de urgência" },
  { categoria: "urgencia", atalho: "/agenda", titulo: "Agenda preenchendo" },
  { categoria: "urgencia", atalho: "/ultimasvagas", titulo: "Últimas vagas" },

  // Pós-venda
  { categoria: "posvenda", atalho: "/agradecimento", titulo: "Agradecimento" },
  { categoria: "posvenda", atalho: "/avaliacao", titulo: "Pedido de avaliação" },
  { categoria: "posvenda", atalho: "/indicacao", titulo: "Pedido de indicação" },
];
