import Image from "next/image";

import {
  WhatsAppChatMock,
  chatExamples,
} from "@/components/whatsapp-chat-mock";

export function ConversationGallery() {
  const screenshotExamples = chatExamples.filter((e) => e.image);
  return (
    <div className="space-y-12">
      <div className="grid gap-8 md:grid-cols-3">
        {screenshotExamples.map((ex, i) => (
          <figure
            key={ex.id}
            className="group flex flex-col items-center"
          >
            <span
              className={`mb-4 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                ex.tagColor === "amber"
                  ? "bg-amber-50 text-amber-900 ring-amber-200"
                  : ex.tagColor === "emerald"
                    ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                    : "bg-primary/10 text-primary ring-primary/20"
              }`}
            >
              {ex.tag}
            </span>
            <div
              className={
                "relative w-full max-w-[260px] overflow-hidden rounded-[1.85rem] border-[7px] border-zinc-800 bg-zinc-900 shadow-xl transition-transform duration-300 group-hover:scale-[1.02] " +
                (i === 1 ? "md:-mt-4" : i === 2 ? "md:mt-4" : "")
              }
            >
              <Image
                src={ex.image!}
                alt={ex.imageAlt}
                width={390}
                height={844}
                className="h-auto w-full object-cover object-top"
                sizes="(max-width: 768px) 85vw, 260px"
                priority={i === 0}
              />
            </div>
            <figcaption className="mt-4 text-center text-sm text-muted-foreground">
              {ex.contactName}
            </figcaption>
          </figure>
        ))}
      </div>

      <div>
        <p className="mb-6 text-center text-sm font-medium text-muted-foreground">
          Mais situações que o seu kit cobre
        </p>
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-visible">
          {chatExamples.map((ex, i) => (
            <WhatsAppChatMock
              key={ex.id}
              contactName={ex.contactName}
              tag={ex.tag}
              tagColor={ex.tagColor}
              messages={[...ex.messages]}
              tilt={i % 2 === 0 ? "left" : "right"}
              className="min-w-[260px] shrink-0 snap-center md:min-w-0 md:items-center"
            />
          ))}
        </div>
      </div>

    </div>
  );
}
