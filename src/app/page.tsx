import Link from "next/link";
import {
  ArrowRight,
  Ban,
  Check,
  Clock,
  MessageSquareText,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";

import { AntesDepoisChats } from "@/components/antes-depois-chats";
import { ConversationGallery } from "@/components/conversation-gallery";
import { Button } from "@/components/ui/button";
import { StartButton } from "@/components/start-button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import {
  WhatsAppChatMock,
  chatExamples,
} from "@/components/whatsapp-chat-mock";

const profissoes = [
  "Barbeiros",
  "Designers",
  "Personal trainers",
  "Fotógrafos",
  "Esteticistas",
  "Consultores",
  "Marceneiros",
  "Advogados",
  "Dentistas",
  "Freelancers",
];

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

const categorias = [
  { nome: "Primeiro contato", qtd: "5+ mensagens" },
  { nome: "Apresentação do serviço", qtd: "4+ mensagens" },
  { nome: "Quebra de objeções", qtd: "8+ mensagens" },
  { nome: "Follow-up", qtd: "6+ mensagens" },
  { nome: "Fechamento", qtd: "5+ mensagens" },
  { nome: "Pós-venda", qtd: "4+ mensagens" },
];

const passos = [
  {
    n: "1",
    t: "Responda algumas perguntas",
    d: "Profissão, serviços, preços, diferenciais e objeções que você mais ouve.",
  },
  {
    n: "2",
    t: "A IA gera seu sistema",
    d: "Apresentação, objeções, follow-ups, fechamento e pós-venda — tudo organizado.",
  },
  {
    n: "3",
    t: "Cole no WhatsApp Business",
    d: "Copie cada mensagem e configure suas respostas rápidas em minutos.",
  },
];

const depoimentos = [
  {
    nome: "Rafael M.",
    iniciais: "RM",
    prof: "Barbeiro · SP",
    texto:
      "Antes eu travava quando o cliente pedia desconto. Agora tenho resposta na hora e fechei 3 clientes na mesma semana.",
    chatIndex: 0,
  },
  {
    nome: "Camila S.",
    iniciais: "CS",
    prof: "Designer · RJ",
    texto:
      "O follow-up de 3 e 7 dias salvou orçamentos que eu ia deixar esfriar. Parece que tenho uma secretária no WhatsApp.",
    chatIndex: 1,
  },
  {
    nome: "Bruno L.",
    iniciais: "BL",
    prof: "Personal · MG",
    texto:
      "Configurei em uma tarde. As mensagens já vêm no meu tom de voz — só copiei e colei nas respostas rápidas.",
    chatIndex: 2,
  },
];

const faq = [
  {
    q: "Funciona para qualquer profissão?",
    a: "Sim. O formulário adapta as mensagens à sua área, serviços, preços e objeções mais comuns.",
  },
  {
    q: "Preciso saber usar IA?",
    a: "Não. Você só responde perguntas simples; o sistema é gerado automaticamente.",
  },
  {
    q: "Quanto tempo até usar no WhatsApp?",
    a: "Em geral menos de 5 minutos após o pagamento: gerar, copiar e colar nas respostas rápidas.",
  },
  {
    q: "É assinatura?",
    a: "Não. Pagamento único com acesso completo ao seu sistema de mensagens.",
  },
];

const preco = process.env.NEXT_PUBLIC_PRICE_BRL || "19,90";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link href="#exemplos" className="hover:text-foreground">
              Exemplos
            </Link>
            <Link href="#beneficios" className="hover:text-foreground">
              Benefícios
            </Link>
            <Link href="#como-funciona" className="hover:text-foreground">
              Como funciona
            </Link>
            <Link href="#preco" className="hover:text-foreground">
              Preço
            </Link>
          </nav>
          <StartButton size="sm">
            Começar agora <ArrowRight />
          </StartButton>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div
          className="absolute -right-32 top-20 -z-10 size-[420px] rounded-full bg-primary/15 blur-3xl"
          aria-hidden
        />
        <div className="container relative grid gap-12 py-14 lg:grid-cols-2 lg:py-20">
          <div className="flex flex-col justify-center animate-fade-up">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium shadow-sm">
                <Sparkles className="size-3.5 text-primary" />
                Sistema de negociação para WhatsApp
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-900 ring-1 ring-amber-200">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1">Feito para quem vende no WhatsApp</span>
              </span>
            </div>
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.25rem]">
              Pare de{" "}
              <span className="text-destructive line-through decoration-2">
                perder vendas
              </span>{" "}
              por não saber o que responder
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              O NegociAí cria um{" "}
              <strong className="font-semibold text-foreground">
                kit completo de mensagens
              </strong>{" "}
              — objeções, follow-up e fechamento — personalizado para o seu
              serviço. Cole no WhatsApp Business e negocie como um profissional.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <StartButton size="xl" className="shadow-lg shadow-primary/25">
                Quero meu sistema agora <ArrowRight />
              </StartButton>
              <Button asChild size="xl" variant="outline">
                <Link href="#exemplos">Ver exemplos no WhatsApp</Link>
              </Button>
            </div>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {[
                "Entrega imediata após o pagamento",
                "+30 mensagens organizadas por etapa",
                "PIX ou cartão · pagamento único",
                `A partir de R$ ${preco}`,
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Check className="size-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 animate-fade-up lg:items-end">
            <WhatsAppChatMock
              contactName={chatExamples[0].contactName}
              tag={chatExamples[0].tag}
              tagColor={chatExamples[0].tagColor}
              messages={[...chatExamples[0].messages]}
              tilt="right"
            />
            <p className="max-w-sm text-center text-xs text-muted-foreground lg:text-right">
              Exemplo ilustrativo — o seu kit sai personalizado com seu serviço
              e seu tom de voz.
            </p>
          </div>
        </div>
      </section>

      {/* Profissões marquee */}
      <section className="border-y bg-secondary/60 py-4">
        <div className="flex overflow-hidden">
          <div className="flex min-w-full shrink-0 animate-marquee items-center gap-8 px-4">
            {[...profissoes, ...profissoes].map((p, i) => (
              <span
                key={`${p}-${i}`}
                className="whitespace-nowrap text-sm font-medium text-muted-foreground"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Dor */}
      <section className="container py-16 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Você se identifica?
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            O cliente some depois do orçamento e você não sabe o que mandar
          </h2>
        </div>
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
          {[
            "\"Vou pensar\" — e nunca mais responde",
            "\"Está caro\" — e você só baixa o preço",
            "Demora horas para responder e esfria o lead",
            "Follow-up genérico que parece spam",
          ].map((dor) => (
            <div
              key={dor}
              className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-4"
            >
              <X className="mt-0.5 size-5 shrink-0 text-destructive" />
              <p className="text-sm font-medium leading-snug">{dor}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-muted-foreground">
          Não é falta de talento — é falta de um{" "}
          <strong className="text-foreground">roteiro de negociação</strong> no
          WhatsApp. O NegociAí resolve isso em minutos.
        </p>
      </section>

      {/* Exemplos WhatsApp */}
      <section id="exemplos" className="border-y bg-gradient-to-b from-secondary/50 to-background py-16 lg:py-20">
        <div className="container">
          <div className="mx-auto mb-4 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Prova social visual
            </p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
              Veja como ficam as conversas no seu WhatsApp
            </h2>
            <p className="mt-3 text-muted-foreground">
              Exemplos ilustrativos de objeção, follow-up e fechamento — o seu kit
              é gerado com os dados do seu negócio.
            </p>
          </div>
          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-6 rounded-2xl border bg-card/80 px-6 py-4 text-center shadow-sm">
            {[
              { valor: "+30", label: "mensagens por kit" },
              { valor: "4", label: "etapas da venda" },
              { valor: "5 min", label: "para configurar" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-extrabold text-primary">{s.valor}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <ConversationGallery />
          </div>
          <p className="mx-auto mt-8 max-w-xl text-center text-xs text-muted-foreground">
            Conversas e prints são exemplos ilustrativos para demonstrar o tipo
            de material que o NegociAí gera. Resultados reais dependem do seu
            atendimento e do seu nicho.
          </p>
        </div>
      </section>

      {/* Com vs Sem */}
      <section className="border-y bg-secondary/40 py-16">
        <div className="container">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-3xl font-bold">Sem roteiro vs com NegociAí</h2>
            <p className="mt-3 text-muted-foreground">
              A diferença entre parecer amador e fechar com confiança.
            </p>
          </div>
          <AntesDepoisChats />
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
            <Card className="border-muted">
              <CardContent className="pt-6">
                <p className="mb-4 flex items-center gap-2 font-semibold text-muted-foreground">
                  <Ban className="size-5" /> Sem sistema
                </p>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {[
                    "Improvisa cada resposta sob pressão",
                    "Esquece de fazer follow-up",
                    "Aceita desconto sem argumento",
                    "Perde tempo digitando a mesma coisa",
                  ].map((item) => (
                    <li key={item} className="flex gap-2">
                      <X className="size-4 shrink-0 text-destructive" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-primary/40 shadow-md ring-1 ring-primary/20">
              <CardContent className="pt-6">
                <p className="mb-4 flex items-center gap-2 font-semibold text-primary">
                  <Check className="size-5" /> Com NegociAí
                </p>
                <ul className="space-y-3 text-sm">
                  {[
                    "Resposta certa para cada objeção",
                    "Sequência de follow-up já escrita",
                    "Argumentos de valor antes de desconto",
                    "Copiar e colar nas respostas rápidas",
                  ].map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check className="size-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* O que você recebe */}
      <section className="container py-16">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-bold">O que vem no seu kit</h2>
          <p className="mt-3 text-muted-foreground">
            Mais de 30 mensagens divididas por etapa da venda — não é um PDF
            genérico.
          </p>
        </div>
        <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
          {categorias.map((c) => (
            <div
              key={c.nome}
              className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 transition-colors hover:border-primary/40"
            >
              <span className="font-medium">{c.nome}</span>
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                {c.qtd}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <StartButton size="lg">
            Gerar meu kit personalizado <ArrowRight />
          </StartButton>
        </div>
      </section>

      {/* Benefícios */}
      <section id="beneficios" className="border-y bg-secondary/30 py-16">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold">
              Tudo que você precisa para fechar mais
            </h2>
            <p className="mt-3 text-muted-foreground">
              Um sistema completo de negociação, organizado por categorias.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {beneficios.map((b) => (
              <Card
                key={b.title}
                className="transition-all hover:border-primary/30 hover:shadow-md"
              >
                <CardContent className="pt-6">
                  <span className="mb-4 grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
                    <b.icon className="size-5" />
                  </span>
                  <h3 className="font-semibold">{b.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {b.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="container py-16">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold">Como funciona</h2>
          <p className="mt-3 text-muted-foreground">
            Três passos. Menos de 5 minutos do pagamento ao WhatsApp configurado.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {passos.map((p) => (
            <div
              key={p.n}
              className="relative rounded-xl border bg-card p-6 shadow-sm"
            >
              <span className="grid size-10 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                {p.n}
              </span>
              <h3 className="mt-4 font-semibold">{p.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Depoimentos */}
      <section className="border-y bg-secondary/40 py-16">
        <div className="container">
          <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center text-center">
            <Users className="mb-2 size-8 text-primary" />
            <h2 className="text-3xl font-bold">Quem vende no WhatsApp aprova</h2>
            <p className="mt-3 text-muted-foreground">
              Prestadores de serviço que pararam de improvisar na negociação.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {depoimentos.map((d) => {
              const chat = chatExamples[d.chatIndex];
              return (
                <Card key={d.nome} className="overflow-hidden bg-card/80">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3 border-b px-5 py-4">
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                        {d.iniciais}
                      </span>
                      <div>
                        <p className="font-semibold">{d.nome}</p>
                        <p className="text-xs text-muted-foreground">{d.prof}</p>
                        <div className="mt-1 flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              className="size-3 fill-amber-400 text-amber-400"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="px-5 py-4">
                      <Quote className="size-6 text-primary/30" />
                      <p className="mt-2 text-sm leading-relaxed">{d.texto}</p>
                    </div>
                    <div className="border-t bg-secondary/30 px-4 py-5">
                      <p className="mb-3 text-center text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        Conversa ilustrativa
                      </p>
                      <WhatsAppChatMock
                        contactName={chat.contactName}
                        tag={chat.tag}
                        tagColor={chat.tagColor}
                        messages={chat.messages.slice(0, 3).map((m) => ({ ...m }))}
                        className="items-center scale-90"
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <p className="mx-auto mt-6 max-w-lg text-center text-xs text-muted-foreground">
            Depoimentos ilustrativos de uso típico do produto.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-3xl font-bold">
            Dúvidas antes de comprar
          </h2>
          <dl className="mt-10 space-y-4">
            {faq.map((item) => (
              <div key={item.q} className="rounded-xl border bg-card px-5 py-4">
                <dt className="font-semibold">{item.q}</dt>
                <dd className="mt-2 text-sm text-muted-foreground">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Preço */}
      <section id="preco" className="pb-20">
        <div className="container">
          <Card className="mx-auto max-w-2xl overflow-hidden border-primary/40 shadow-xl">
            <div className="relative bg-primary px-8 py-8 text-center text-primary-foreground">
              <p className="text-sm font-medium uppercase tracking-wide opacity-90">
                Oferta de lançamento
              </p>
              <p className="mt-2 flex items-baseline justify-center gap-2">
                <span className="text-lg opacity-75 line-through">
                  R$ 97,00
                </span>
                <span className="text-5xl font-extrabold tracking-tight">
                  R$ {preco}
                </span>
              </p>
              <p className="mt-1 text-sm opacity-90">
                pagamento único · acesso imediato · PIX ou cartão
              </p>
            </div>
            <CardContent className="space-y-3 p-8">
              {[
                "Sistema completo personalizado com IA",
                "Objeções, follow-ups e fechamento",
                "Copiar mensagem a mensagem",
                "Uso vitalício do material gerado",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="grid size-5 place-items-center rounded-full bg-primary/10 text-primary">
                    <Check className="size-3.5" />
                  </span>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
              <div className="mt-4 rounded-lg border border-dashed bg-muted/50 px-4 py-3 text-center text-sm text-muted-foreground">
                <ShieldCheck className="mx-auto mb-1 size-5 text-primary" />
                Pagamento seguro via Asaas. Após confirmar, você já acessa o
                formulário e gera seu kit.
              </div>
              <StartButton size="xl" className="mt-2 w-full shadow-md">
                Quero configurar meu WhatsApp agora <ArrowRight />
              </StartButton>
              <p className="text-center text-xs text-muted-foreground">
                Sem mensalidade. Sem fidelidade.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA final */}
      <section className="border-t bg-gradient-to-br from-primary/10 via-background to-accent/30 py-14">
        <div className="container text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Seu próximo cliente está no WhatsApp.{" "}
            <span className="text-primary">Esteja pronto para responder.</span>
          </h2>
          <StartButton size="xl" className="mt-8">
            Começar agora por R$ {preco} <ArrowRight />
          </StartButton>
        </div>
      </section>

      <footer className="border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground sm:flex-row">
          <Logo className="text-base" iconClassName="size-4" />
          <p>
            © {new Date().getFullYear()} NegociAí. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}
