import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { BuyButton } from "@/components/buy-button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/logo";

const beneficios = [
  {
    icon: MessageSquareText,
    title: "Respostas profissionais",
    desc: "Mensagens prontas e personalizadas para cada momento da conversa.",
  },
  {
    icon: ShieldCheck,
    title: "Quebra de objeções",
    desc: "Saiba exatamente o que responder quando o cliente diz \"está caro\".",
  },
  {
    icon: Clock,
    title: "Follow-ups automáticos",
    desc: "Sequências de 1, 3, 7 e 15 dias para não perder nenhum cliente.",
  },
  {
    icon: TrendingUp,
    title: "Mais fechamentos",
    desc: "Mensagens de urgência e fechamento que aumentam sua conversão.",
  },
  {
    icon: Zap,
    title: "Configuração rápida",
    desc: "Tudo pronto para colar nas respostas rápidas do WhatsApp Business.",
  },
  {
    icon: Sparkles,
    title: "Feito sob medida",
    desc: "Gerado com IA a partir da sua profissão, serviços e diferenciais.",
  },
];

const passos = [
  { n: "1", t: "Responda algumas perguntas", d: "Profissão, serviços, preços, diferenciais e objeções." },
  { n: "2", t: "A IA gera seu sistema", d: "Apresentação, objeções, follow-ups, fechamento e pós-venda." },
  { n: "3", t: "Cole no WhatsApp Business", d: "Copie cada mensagem e configure suas respostas rápidas." },
];

const preco = process.env.NEXT_PUBLIC_PRICE_BRL || "19,90";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <BuyButton size="sm">
            Começar agora <ArrowRight />
          </BuyButton>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
        <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-accent/70 to-transparent" aria-hidden />
        <div className="container relative grid gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div className="flex flex-col justify-center animate-fade-up">
            <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              A resposta certa na hora da negociação
            </span>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Configure seu WhatsApp para{" "}
              <span className="text-primary">vender mais</span> em menos de 5
              minutos
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Receba respostas prontas para negociar, quebrar objeções e fechar
              mais negócios. Transforme seu WhatsApp em uma máquina de fechar
              vendas.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <BuyButton size="xl">
                COMEÇAR AGORA <ArrowRight />
              </BuyButton>
              <Button asChild size="xl" variant="outline">
                <Link href="#como-funciona">Como funciona</Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Check className="size-4 text-primary" /> Entrega imediata
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="size-4 text-primary" /> +30 mensagens prontas
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="size-4 text-primary" /> A partir de R$ {preco}
              </span>
            </div>
          </div>

          {/* WhatsApp mockup */}
          <div className="flex items-center justify-center animate-fade-up">
            <WhatsAppPreview />
          </div>
        </div>
      </section>

      {/* Sales headline */}
      <section className="border-y bg-secondary/50">
        <div className="container py-14 text-center">
          <h2 className="mx-auto max-w-3xl text-2xl font-bold sm:text-3xl">
            Não sabe o que responder quando o cliente diz{" "}
            <span className="text-primary">&ldquo;está caro&rdquo;</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Configure seu WhatsApp profissional em menos de 5 minutos e tenha
            respostas prontas para negociar, quebrar objeções e fechar mais
            vendas.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="container py-16">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold">Tudo que você precisa para fechar mais</h2>
          <p className="mt-3 text-muted-foreground">
            Um sistema completo de negociação, organizado por categorias.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {beneficios.map((b) => (
            <Card key={b.title} className="transition-shadow hover:shadow-md">
              <CardContent className="pt-6">
                <span className="mb-4 grid size-11 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <b.icon className="size-5" />
                </span>
                <h3 className="font-semibold">{b.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{b.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="border-y bg-secondary/40">
        <div className="container py-16">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold">Como funciona</h2>
            <p className="mt-3 text-muted-foreground">
              Em 3 passos simples você configura tudo.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {passos.map((p) => (
              <div key={p.n} className="relative rounded-xl border bg-card p-6">
                <span className="grid size-10 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {p.n}
                </span>
                <h3 className="mt-4 font-semibold">{p.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / CTA */}
      <section className="container py-16">
        <Card className="mx-auto max-w-2xl overflow-hidden border-primary/30">
          <div className="bg-primary px-8 py-6 text-center text-primary-foreground">
            <p className="text-sm font-medium uppercase tracking-wide opacity-90">
              Acesso completo
            </p>
            <p className="mt-1 text-4xl font-extrabold">R$ {preco}</p>
            <p className="text-sm opacity-90">pagamento único · entrega imediata</p>
          </div>
          <CardContent className="space-y-3 p-8">
            {[
              "Respostas profissionais",
              "Quebra de objeções",
              "Follow-ups automáticos",
              "Mais fechamentos",
              "Configuração rápida",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="grid size-5 place-items-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-3.5" />
                </span>
                <span className="text-sm">{item}</span>
              </div>
            ))}
            <BuyButton size="xl" className="mt-4 w-full">
              QUERO CONFIGURAR MEU WHATSAPP <ArrowRight />
            </BuyButton>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground sm:flex-row">
          <Logo className="text-base" iconClassName="size-4" />
          <p>© {new Date().getFullYear()} NegociAí. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  );
}

function WhatsAppPreview() {
  return (
    <div className="w-full max-w-sm rotate-1 rounded-[2rem] border-8 border-foreground/90 bg-[#0b141a] shadow-2xl">
      <div className="flex items-center gap-3 rounded-t-2xl bg-[#202c33] px-4 py-3">
        <div className="size-9 rounded-full bg-primary/80" />
        <div>
          <p className="text-sm font-semibold text-white">Cliente</p>
          <p className="text-[11px] text-emerald-300">online</p>
        </div>
      </div>
      <div className="space-y-2 px-4 py-5">
        <Bubble side="left">Achei meio caro... 🤔</Bubble>
        <Bubble side="right">
          Entendo perfeitamente! Além do serviço, você leva experiência,
          segurança e acompanhamento profissional.
        </Bubble>
        <Bubble side="right">
          Posso te explicar tudo que está incluso pra você comparar de forma
          justa?
        </Bubble>
        <Bubble side="left">Pode mandar! 👍</Bubble>
      </div>
    </div>
  );
}

function Bubble({
  side,
  children,
}: {
  side: "left" | "right";
  children: React.ReactNode;
}) {
  return (
    <div className={side === "right" ? "flex justify-end" : "flex justify-start"}>
      <p
        className={
          "max-w-[80%] rounded-2xl px-3 py-2 text-sm " +
          (side === "right"
            ? "rounded-br-sm bg-[#005c4b] text-white"
            : "rounded-bl-sm bg-[#202c33] text-white")
        }
      >
        {children}
      </p>
    </div>
  );
}
