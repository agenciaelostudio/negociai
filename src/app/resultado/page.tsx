"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  ClipboardCopy,
  Copy,
  Download,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { copyText } from "@/lib/clipboard";
import {
  CATEGORIA_LABELS,
  CATEGORIA_ORDER,
  type Categoria,
  type GenerateResponse,
  type Mensagem,
} from "@/lib/types";

const RESULT_KEY = "negociai:result";

export default function ResultadoPage() {
  const [data, setData] = useState<GenerateResponse | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(RESULT_KEY);
      if (raw) setData(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoaded(true);
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
    a.download = "negociai-respostas.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loaded && !data) {
    return (
      <EmptyState />
    );
  }

  const total = data?.mensagens.length ?? 0;

  return (
    <main className="min-h-screen bg-secondary/30 pb-20">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-2">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download /> <span className="hidden sm:inline">Baixar</span>
            </Button>
            <Button onClick={handleCopyAll} size="sm">
              {copied === "__all__" ? <Check /> : <ClipboardCopy />}
              COPIAR TUDO
            </Button>
          </div>
        </div>
      </header>

      <div className="container max-w-3xl py-10">
        <div className="mb-8 text-center">
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
                                <Copy /> COPIAR
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

        <div className="mt-12 rounded-xl border bg-card p-6 text-center">
          <h3 className="font-semibold">Como configurar no WhatsApp Business</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Abra o WhatsApp Business → Configurações → Ferramentas comerciais →
            Respostas rápidas. Crie uma resposta para cada atalho (ex:{" "}
            <code className="rounded bg-muted px-1">/caro</code>) e cole a
            mensagem correspondente.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/formulario">Gerar outro sistema</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <main className="grid min-h-screen place-items-center bg-secondary/30 p-6">
      <Card className="max-w-md text-center">
        <CardContent className="p-8">
          <Logo className="mx-auto w-fit" />
          <h1 className="mt-6 text-xl font-bold">Nenhum resultado encontrado</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Preencha o formulário para gerar seu sistema de negociação
            personalizado.
          </p>
          <Button asChild className="mt-6">
            <Link href="/formulario">
              <ArrowLeft /> Ir para o formulário
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
