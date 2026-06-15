import { ArrowRight } from "lucide-react";

import { WhatsAppChatMock } from "@/components/whatsapp-chat-mock";

export function AntesDepoisChats() {
  return (
    <div className="mx-auto grid max-w-4xl items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
      <div className="space-y-3">
        <p className="text-center text-sm font-bold text-destructive">
          ❌ Sem roteiro
        </p>
        <WhatsAppChatMock
          contactName="Cliente"
          contactHint="visto por último há 2 dias"
          tag="Improviso"
          tagColor="amber"
          messages={[
            { side: "left", text: "Tá caro demais", time: "Ontem" },
            { side: "right", text: "Ah... posso fazer um desconto então", time: "Ontem" },
            { side: "left", text: "Ok vou ver", time: "Ontem" },
          ]}
          className="items-center opacity-90"
        />
      </div>

      <ArrowRight className="mx-auto hidden size-8 text-primary md:block" />

      <div className="space-y-3">
        <p className="text-center text-sm font-bold text-primary">
          ✓ Com NegociAí
        </p>
        <WhatsAppChatMock
          contactName="Cliente · orçamento"
          tag="Resposta do kit"
          tagColor="emerald"
          messages={[
            { side: "left", text: "Tá caro demais", time: "14:10" },
            {
              side: "right",
              text: "Entendo! Deixa eu te mostrar o que está incluso — assim você compara o valor real.",
              time: "14:11",
            },
            { side: "left", text: "Manda sim!", time: "14:12" },
          ]}
          className="items-center ring-2 ring-primary/30 ring-offset-2 ring-offset-background rounded-3xl"
        />
      </div>
    </div>
  );
}
