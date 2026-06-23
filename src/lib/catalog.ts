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

  // ── OBJEÇÕES (8 existentes + 22 novas = 30) ───────────────
  // Preço/Valor
  { categoria: "objecoes", atalho: "/caro", titulo: "Cliente achou caro" },
  { categoria: "objecoes", atalho: "/desconto", titulo: "Cliente pede desconto" },
  { categoria: "objecoes", atalho: "/semvalor", titulo: "Cliente não vê valor no serviço" },
  { categoria: "objecoes", atalho: "/promocao", titulo: "Cliente esperando promoção" },

  // Indecisão
  { categoria: "objecoes", atalho: "/pensar", titulo: "Cliente vai pensar" },
  { categoria: "objecoes", atalho: "/esposa", titulo: "Vai falar com esposa/marido" },
  { categoria: "objecoes", atalho: "/pesquisar", titulo: "Cliente quer pesquisar" },
  { categoria: "objecoes", atalho: "/comparando", titulo: "Cliente está comparando" },

  // Tempo/Prioridade
  { categoria: "objecoes", atalho: "/semtempo", titulo: "Cliente sem tempo / ocupado" },
  { categoria: "objecoes", atalho: "/depois", titulo: "Cliente diz 'depois eu vejo'" },
  { categoria: "objecoes", atalho: "/naoagora", titulo: "Cliente diz que não é prioridade" },
  { categoria: "objecoes", atalho: "/rapidinho", titulo: "Cliente quer algo rápido e simples" },

  // Financeiro
  { categoria: "objecoes", atalho: "/orcamento", titulo: "Pedido de orçamento" },
  { categoria: "objecoes", atalho: "/semdinheiro", titulo: "Cliente sem dinheiro agora" },
  { categoria: "objecoes", atalho: "/sinal", titulo: "Cliente questiona pagamento adiantado" },

  // Concorrência/Confiança
  { categoria: "objecoes", atalho: "/tenhoutro", titulo: "Já tem outro profissional" },
  { categoria: "objecoes", atalho: "/naoconfio", titulo: "Cliente já teve má experiência" },
  { categoria: "objecoes", atalho: "/concorrencia", titulo: "Concorrente é mais barato" },
  { categoria: "objecoes", atalho: "/provas", titulo: "Cliente quer ver resultados antes" },
  { categoria: "objecoes", atalho: "/caso_especial", titulo: "Cliente acha que é um caso diferente" },

  // Decisão/Burocracia
  { categoria: "objecoes", atalho: "/chefe", titulo: "Precisa falar com chefe/sócio" },
  { categoria: "objecoes", atalho: "/garantia", titulo: "Cliente pede garantia" },
  { categoria: "objecoes", atalho: "/autorizacao", titulo: "Cliente precisa de autorização" },

  // Pós-contato
  { categoria: "objecoes", atalho: "/silencio", titulo: "Cliente leu e não respondeu" },
  { categoria: "objecoes", atalho: "/cancelar", titulo: "Cliente quer cancelar" },
  { categoria: "objecoes", atalho: "/reclamacao", titulo: "Cliente insatisfeito" },

  // Outras
  { categoria: "objecoes", atalho: "/distancia", titulo: "Cliente reclama da distância" },
  { categoria: "objecoes", atalho: "/naoentendi", titulo: "Cliente não entende o serviço" },
  { categoria: "objecoes", atalho: "/modalidade", titulo: "Cliente prefere outra modalidade" },
  { categoria: "objecoes", atalho: "/reuniao", titulo: "Cliente quer reunião antes" },

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