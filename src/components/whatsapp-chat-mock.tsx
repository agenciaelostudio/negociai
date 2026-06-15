import { CheckCheck } from "lucide-react";

export type ChatMessage = {
  side: "left" | "right";
  text: string;
  time?: string;
};

export type WhatsAppChatMockProps = {
  contactName: string;
  contactHint?: string;
  tag: string;
  tagColor?: "primary" | "amber" | "emerald";
  messages: ChatMessage[];
  dateLabel?: string;
  className?: string;
  tilt?: "none" | "left" | "right";
};

const tagStyles = {
  primary: "bg-primary/10 text-primary ring-primary/20",
  amber: "bg-amber-50 text-amber-900 ring-amber-200",
  emerald: "bg-emerald-50 text-emerald-800 ring-emerald-200",
};

export function WhatsAppChatMock({
  contactName,
  contactHint = "online",
  tag,
  tagColor = "primary",
  messages,
  dateLabel = "Hoje",
  className = "",
  tilt = "none",
}: WhatsAppChatMockProps) {
  const tiltClass =
    tilt === "left"
      ? "-rotate-2"
      : tilt === "right"
        ? "rotate-2"
        : "";

  return (
    <article
      className={`flex flex-col ${className}`}
      aria-label={`Exemplo de conversa: ${tag}`}
    >
      <span
        className={`mb-3 inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ring-1 ${tagStyles[tagColor]}`}
      >
        {tag}
      </span>
      <div
        className={`w-full max-w-[280px] rounded-[1.75rem] border-[6px] border-zinc-800 bg-[#0b141a] shadow-xl ${tiltClass}`}
      >
        <header className="flex items-center gap-2.5 rounded-t-[1.35rem] bg-[#202c33] px-3 py-2.5">
          <div className="size-8 shrink-0 rounded-full bg-gradient-to-br from-primary to-emerald-600" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {contactName}
            </p>
            <p className="text-[10px] text-emerald-300">{contactHint}</p>
          </div>
        </header>
        <div
          className="space-y-1.5 px-3 py-4"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        >
          <p className="mb-2 text-center text-[10px] text-zinc-500">
            {dateLabel}
          </p>
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.side === "right" ? "flex justify-end" : "flex justify-start"
              }
            >
              <div className="max-w-[88%]">
                <p
                  className={
                    "rounded-lg px-2.5 py-1.5 text-[13px] leading-snug text-white " +
                    (m.side === "right"
                      ? "rounded-br-none bg-[#005c4b]"
                      : "rounded-bl-none bg-[#202c33]")
                  }
                >
                  {m.text}
                </p>
                {m.time && (
                  <p
                    className={
                      "mt-0.5 flex items-center gap-0.5 text-[9px] text-zinc-500 " +
                      (m.side === "right" ? "justify-end" : "")
                    }
                  >
                    {m.time}
                    {m.side === "right" && (
                      <CheckCheck className="size-2.5 text-sky-400" />
                    )}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export const chatExamples = [
  {
    id: "objecao",
    tag: "Quebra de objeção",
    tagColor: "amber" as const,
    contactName: "Cliente · orçamento",
    image: "/screenshots/whatsapp-objecao-preco.webp",
    imageAlt: "Exemplo ilustrativo de conversa no WhatsApp sobre preço",
    messages: [
      { side: "left" as const, text: "Achei meio caro o pacote 😬", time: "14:21" },
      {
        side: "right" as const,
        text: "Entendo! O valor já inclui material premium + garantia de 30 dias. Assim você não paga duas vezes.",
        time: "14:22",
      },
      {
        side: "right" as const,
        text: "Quer que eu te mande tudo que está incluso pra comparar de forma justa?",
        time: "14:22",
      },
      { side: "left" as const, text: "Pode mandar sim 👍", time: "14:24" },
    ],
  },
  {
    id: "followup",
    tag: "Follow-up dia 3",
    tagColor: "primary" as const,
    contactName: "Mariana · design",
    image: "/screenshots/whatsapp-followup.webp",
    imageAlt: "Exemplo ilustrativo de follow-up no WhatsApp",
    messages: [
      { side: "left" as const, text: "Vou pensar e te aviso!", time: "Ter 09:10" },
      {
        side: "right" as const,
        text: "Perfeito, Mariana! Qualquer dúvida sobre o escopo, estou por aqui 😊",
        time: "Ter 09:12",
      },
      { side: "right" as const, text: "Oi! Passando pra saber se ficou alguma dúvida no orçamento do logo?", time: "Sex 10:05" },
      { side: "left" as const, text: "Oi! Na verdade queria saber se divide em 2x", time: "Sex 10:18" },
    ],
  },
  {
    id: "fechamento",
    tag: "Fechamento",
    tagColor: "emerald" as const,
    contactName: "João · personal",
    image: "/screenshots/whatsapp-fechamento.webp",
    imageAlt: "Exemplo ilustrativo de fechamento de venda no WhatsApp",
    messages: [
      {
        side: "right" as const,
        text: "João, tenho vaga na terça 7h ou quinta 19h. Qual horário fica melhor pra você?",
        time: "11:40",
      },
      { side: "left" as const, text: "Quinta 19h! Pode ser?", time: "11:52" },
      {
        side: "right" as const,
        text: "Fechado! 🎯 Te mando o link de confirmação e orientações de chegada.",
        time: "11:53",
      },
      { side: "left" as const, text: "Show, obrigado!", time: "11:54" },
    ],
  },
  {
    id: "reativacao",
    tag: "Reativação",
    tagColor: "primary" as const,
    contactName: "Ana · estética",
    image: null,
    imageAlt: "",
    messages: [
      {
        side: "right" as const,
        text: "Oi Ana! Faz um tempinho que conversamos — ainda tem interesse no protocolo de pele?",
        time: "15:02",
      },
      { side: "left" as const, text: "Oi! Agora sim, pode me passar os horários?", time: "15:20" },
      {
        side: "right" as const,
        text: "Claro! Tenho quarta 14h ou sexta 10h com 10% pra retorno. Qual prefere?",
        time: "15:21",
      },
    ],
  },
] as const;
