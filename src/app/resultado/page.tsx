"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ClipboardCopy,
  Copy,
  Download,
  LogOut,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Logo } from "@/components/logo";
import { copyText } from "@/lib/clipboard";
import { createClient } from "@/lib/supabase/client";
import {
  CATEGORIA_LABELS,
  CATEGORIA_ORDER,
  type Categoria,
  type GenerateResponse,
  type Mensagem,
} from "@/lib/types";

const RESULT_KEY = "negociai:result";

const GUIA_PASSOS = [
  {
    titulo: "1. Abra o WhatsApp Business",
    descricao:
      'Vá em Configurações → Ferramentas comerciais → Respostas Rápidas e toque no "+" para criar uma nova.',
  },
  {
    titulo: "2. Cole a mensagem",
    descricao:
      'No campo "Mensagem", cole o texto do script NegociAí que você deseja usar.',
  },
  {
    titulo: "3. Defina o atalho",
    descricao:
      'No campo "Atalho", use o código do script (ex: /caro, /ola, /preco). Assim você acessa rapidamente digitando "/" no chat.',
  },
  {
    titulo: "4. Salve e use",
    descricao:
      'Toque em "Salvar". Na próxima conversa, digite "/" para ver todas as suas respostas rápidas e escolha a ideal para cada momento.',
  },
];

const DICAS = [
  "Personalize sempre — adicione o nome do cliente para criar conexão.",
  "Revise antes de enviar — ajuste detalhes específicos de cada negociação.",
  "Configure também Mensagem de Saudação e Ausência em Ferramentas Comerciais.",
  "Teste diferentes scripts e veja quais têm melhor resultado com seus clientes.",
];

export default function ResultadoPage() {
  const router = useRouter();
  const [data, setData] = useState<GenerateResponse | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [guiaAberto, setGuiaAberto] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(RESULT_KEY);
      if (raw) setData(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoaded(true);

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: auth }) => {
      setEmail(auth.user?.email ?? null);
    });
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<Categoria, Mensagem[]>();
    for (const cat of CATEGORIA_ORDER) map.set(cat, []);
    for (const m of data?.mensagens ?? []) {
      if (!map.has(m.categoria)) map.set(m.categoria, []);
      map.get(m.categoria)!.push(m);
    }
    return CATEGORIA_ORDER.map((cat) => ({
      categoria: cat,
      label: CATEGORIA_LABELS[cat],
      itens: map.get(cat) ?? [],
    })).filter((g) => g.itens.length > 0);
  }, [data]);

  async function handleCopy(text: string, id: string) {
    const ok = await copyText(text);
    if (ok) {
      setCopied(id);
      toast.success("Copiado com sucesso.");
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 1800);
    } else {
      toast.error("Não foi possível copiar.");
    }
  }

  function buildAll(): string {
    return (data?.mensagens ?? [])
      .map((m) => `${m.atalho}\n${m.mensagem}`)
      .join("\n\n———\n\n");
  }

  async function handleCopyAll() {
    await handleCopy(buildAll(), "__all__");
  }

  function handleDownload() {
    const blob = new Blob([buildAll()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "negociai-scripts.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/entrar");
  }

  if (loaded && !data) {
    return <EmptyState />;
  }

  const total = data?.mensagens.length ?? 0;

  return (
    <main className="min-h-screen bg-secondary/30 pb-20">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/painel")}
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Voltar ao painel</span>
            </Button>
            <Logo />
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download />
              <span className="hidden sm:inline">Baixar</span>
            </Button>
            <Button onClick={handleCopyAll} size="sm">
              {copied === "__all__" ? <Check /> : <ClipboardCopy />}
              <span className="hidden sm:inline">Copiar tudo</span>
            </Button>
            {email && (
              <Button variant="ghost" size="sm" onClick={signOut} title={email}>
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container max-w-3xl py-10 space-y-10">

        {/* Guia de instalação */}
        <Collapsible open={guiaAberto} onOpenChange={setGuiaAberto}>
          <Card className="border-primary/30 bg-primary/5">
            <CollapsibleTrigger asChild>
              <button className="flex w-full items-center justify-between p-5 text-left">
                <div className="flex items-center gap-3">
                  <Smartphone className="size-5 text-primary" />
                  <div>
                    <p className="font-semibold">
                      Como instalar seus scripts no WhatsApp Business
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Passo a passo para ativar as respostas rápidas
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`size-5 text-muted-foreground transition-transform ${
                    guiaAberto ? "rotate-180" : ""
                  }`}
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-5 pb-5 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {GUIA_PASSOS.map((passo) => (
                    <div
                      key={passo.titulo}
                      className="rounded-lg border bg-background p-4"
                    >
                      <p className="font-semibold text-sm text-primary">
                        {passo.titulo}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {passo.descricao}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg border bg-background p-4">
                  <p className="font-semibold text-sm mb-3">
                    💡 Dicas para melhores resultados
                  </p>
                  <ul className="space-y-2">
                    {DICAS.map((dica) => (
                      <li
                        key={dica}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="size-4 mt-0.5 shrink-0 text-primary" />
                        {dica}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Cabeçalho de resultado */}
        <div className="text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            <Sparkles className="size-3.5" /> Seu sistema está pronto
          </span>
          <h1 className="text-3xl font-bold">Seu NegociAí personalizado</h1>
          <p className="mt-2 text-muted-foreground">
            {total} mensagens prontas para colar nas respostas rápidas do
            WhatsApp Business.
            {data?.source === "fallback" && (
              <span className="mt-1 block text-xs">
                (Gerado com o modelo local — configure a OPENAI_API_KEY para
                respostas via IA.)
              </span>
            )}
          </p>
        </div>

        {/* Scripts por categoria */}
        <div className="space-y-10">
          {grouped.map((group) => (
            <section key={group.categoria}>
              <div className="mb-3 flex items-center gap-3">
                <h2 className="text-lg font-bold">{group.label}</h2>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {group.itens.length}
                </span>
              </div>
              <div className="space-y-3">
                {group.itens.map((m) => {
                  const id = m.atalho + m.titulo;
                  return (
                    <Card key={id}>
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold leading-tight">
                              {m.titulo}
                            </p>
                            <code className="mt-1 inline-block rounded bg-accent px-1.5 py-0.5 text-xs font-medium text-accent-foreground">
                              {m.atalho}
                            </code>
                          </div>
                          <Button
                            size="sm"
                            variant={copied === id ? "secondary" : "outline"}
                            onClick={() => handleCopy(m.mensagem, id)}
                            className="shrink-0"
                          >
                            {copied === id ? (
                              <>
                                <Check /> Copiado
                              </>
                            ) : (
                              <>
                                <Copy /> Copiar
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                          {m.mensagem}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Rodapé de ação */}
        <div className="rounded-xl border bg-card p-6 text-center">
          <h3 className="font-semibold">Pronto para usar!</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Copie cada mensagem e configure como resposta rápida no WhatsApp
            Business usando o atalho indicado. Volte ao painel para gerar novos
            scripts quando quiser.
          </p>
          <div className="mt-4 flex justify-center gap-3 flex-wrap">
            <Button variant="outline" onClick={() => router.push("/painel")}>
              <ArrowLeft className="size-4" /> Voltar ao painel
            </Button>
            <Button onClick={handleCopyAll}>
              {copied === "__all__" ? <Check /> : <ClipboardCopy />}
              Copiar tudo
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

function EmptyState() {
  const router = useRouter();
  return (
    <main className="grid min-h-screen place-items-center bg-secondary/30 p-6">
      <Card className="max-w-md text-center">
        <CardContent className="p-8">
          <Logo className="mx-auto w-fit" />
          <h1 className="mt-6 text-xl font-bold">Nenhum resultado encontrado</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Volte ao painel e clique em "Gerar scripts" para criar seu sistema
            personalizado.
          </p>
          <Button className="mt-6" onClick={() => router.push("/painel")}>
            <ArrowLeft className="size-4" /> Ir para o painel
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
