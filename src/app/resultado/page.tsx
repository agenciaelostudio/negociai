"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ClipboardCopy,
  Copy,
  Download,
  HelpCircle,
  Lightbulb,
  Loader2,
  LogOut,
  Smartphone,
  Sparkles,
  MessageCircle,
  Store,
  FileText,
  Eye,
  MessagesSquare,
  ChevronRight,
  Zap,
  BookOpen,
  Bell,
  Star,
  ChevronUp,
  Maximize2,
  Minimize2,
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

// ─── Guia visual ──────────────────────────────────────────────
const GUIAS = {
  business: [
    { icon: "download", title: "Baixe o WhatsApp Business", desc: "É grátis! Pesquise na loja do seu celular. Ele tem 'Respostas Rápidas' que salvam mensagens prontas pra usar com um toque." },
    { icon: "settings", title: "Abra as Configurações", desc: "Toque no menu (⋮) → Configurações → Ferramentas comerciais → Respostas rápidas" },
    { icon: "plus", title: "Crie uma nova resposta", desc: "Na tela de Respostas Rápidas, toque em '+' no canto inferior direito." },
    { icon: "paste", title: "Cole o script", desc: "Campo Mensagem → cole o texto. Campo Atalho → digite exatamente igual ao card (ex: /caro). Toque em Salvar." },
    { icon: "repeat", title: "Repita para cada script", desc: "Faça isso para cada mensagem do kit. Depois de configurado, você usa com UM TOQUE!" },
    { icon: "chat", title: "Use na conversa", desc: "Digite / no chat → aparece a lista → toque na resposta → a mensagem aparece prontinha!" },
  ],
  comum: [
    { icon: "download", title: "Abra o WhatsApp", desc: "Pode ser o normal. Os scripts ficam salvos em um lugar de fácil acesso." },
    { icon: "chat", title: "Crie um chat com você mesmo", desc: "Inicie um chat com seu próprio número ou crie um grupo só com você. Fixe no topo pra achar rápido." },
    { icon: "copy", title: "Cole todos os scripts lá", desc: "Copie cada script e cole nesse chat. Deixe organizado: /caro → [texto], /desconto → [texto]..." },
    { icon: "send", title: "Copie e cole na conversa", desc: "Abra o chat com você mesmo → copie o script → volte pro cliente → cole e envie!" },
    { icon: "keyboard", title: "Atalhos do teclado", desc: "No celular: Ajustes → Teclado → Atalhos. Cadastre /caro como atalho pro texto completo." },
  ],
};

const CATEGORIA_ICON_MAP: Record<string, React.ReactNode> = {
  primeiro_contato: <MessageCircle className="size-4" />,
  apresentacao: <FileText className="size-4" />,
  quebra_objecoes: <Zap className="size-4" />,
  follow_up: <Bell className="size-4" />,
  fechamento: <Sparkles className="size-4" />,
  pos_venda: <Star className="size-4" />,
};

function getCategoriaIcon(categoria: string) {
  return CATEGORIA_ICON_MAP[categoria] || <MessagesSquare className="size-4" />;
}

const GUIDE_ICONS: Record<string, React.ReactNode> = {
  download: <div className="size-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 ring-1 ring-emerald-500/20 flex items-center justify-center"><svg className="size-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>,
  settings: <div className="size-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/5 ring-1 ring-blue-500/20 flex items-center justify-center"><svg className="size-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>,
  plus: <div className="size-8 rounded-lg bg-gradient-to-br from-green-500/20 to-green-500/5 ring-1 ring-green-500/20 flex items-center justify-center"><svg className="size-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></div>,
  paste: <div className="size-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-500/5 ring-1 ring-purple-500/20 flex items-center justify-center"><svg className="size-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg></div>,
  repeat: <div className="size-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-500/5 ring-1 ring-amber-500/20 flex items-center justify-center"><svg className="size-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></div>,
  chat: <div className="size-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20 flex items-center justify-center"><svg className="size-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg></div>,
  copy: <div className="size-8 rounded-lg bg-gradient-to-br from-sky-500/20 to-sky-500/5 ring-1 ring-sky-500/20 flex items-center justify-center"><svg className="size-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></div>,
  send: <div className="size-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 ring-1 ring-emerald-500/20 flex items-center justify-center"><svg className="size-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></div>,
  keyboard: <div className="size-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-violet-500/5 ring-1 ring-violet-500/20 flex items-center justify-center"><svg className="size-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>,
};

export default function ResultadoPage() {
  return (
    <Suspense fallback={
      <main className="grid min-h-screen place-items-center bg-gradient-to-b from-secondary/30 to-secondary/10">
        <div className="text-center space-y-4">
          <div className="relative mx-auto size-12">
            <Loader2 className="size-12 animate-spin text-primary" />
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
          </div>
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </main>
    }>
      <ResultadoContent />
    </Suspense>
  );
}

function ResultadoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const generationId = searchParams.get("id");
  const [data, setData] = useState<GenerateResponse | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadingFromApi, setLoadingFromApi] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [guiaAberto, setGuiaAberto] = useState(false);
  const [modoGuia, setModoGuia] = useState<"business" | "comum">("business");
  const [email, setEmail] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [faqAberto, setFaqAberto] = useState(false);

  useEffect(() => {
    async function load() {
      if (generationId) {
        setLoadingFromApi(true);
        try {
          const res = await fetch(`/api/generations/${generationId}`);
          if (!res.ok) {
            if (res.status === 401) { router.replace("/entrar"); return; }
            throw new Error("not found");
          }
          const json = await res.json();
          setData({ mensagens: json.mensagens ?? [], source: "fallback" });
        } catch { /* ignore */ }
        finally { setLoadingFromApi(false); setLoaded(true); }
        return;
      }
      try { const raw = sessionStorage.getItem(RESULT_KEY); if (raw) setData(JSON.parse(raw)); } catch { /* ignore */ }
      setLoaded(true);
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: auth }) => setEmail(auth.user?.email ?? null));
    }
    load();
  }, [generationId, router]);

  const grouped = useMemo(() => {
    const map = new Map<Categoria, Mensagem[]>();
    for (const cat of CATEGORIA_ORDER) map.set(cat, []);
    for (const m of data?.mensagens ?? []) {
      if (!map.has(m.categoria)) map.set(m.categoria, []);
      map.get(m.categoria)!.push(m);
    }
    return CATEGORIA_ORDER.map((cat) => ({
      categoria: cat, label: CATEGORIA_LABELS[cat],
      itens: map.get(cat) ?? [],
    })).filter((g) => g.itens.length > 0);
  }, [data]);

  async function handleCopy(text: string, id: string) {
    const ok = await copyText(text);
    if (ok) { setCopied(id); toast.success("Copiado!"); setTimeout(() => setCopied((c) => (c === id ? null : c)), 1500); }
    else { toast.error("Erro ao copiar."); }
  }

  function buildAll(): string { return (data?.mensagens ?? []).map((m) => `${m.atalho}\n${m.mensagem}`).join("\n\n———\n\n"); }
  async function handleCopyAll() { await handleCopy(buildAll(), "__all__"); }
  function handleDownload() {
    const blob = new Blob([buildAll()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = "negociai-scripts.txt"; a.click(); URL.revokeObjectURL(url);
  }
  async function signOut() { const supabase = createClient(); await supabase.auth.signOut(); router.push("/entrar"); }

  function toggleCard(id: string) { setExpandedCard((prev) => (prev === id ? null : id)); }

  if (loadingFromApi) return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-b from-secondary/40 to-secondary/10">
      <div className="text-center space-y-4">
        <div className="relative mx-auto size-12"><Loader2 className="size-12 animate-spin text-primary" /><div className="absolute inset-0 animate-ping rounded-full bg-primary/10" /></div>
        <p className="text-sm text-muted-foreground">Carregando seus scripts...</p>
      </div>
    </main>
  );
  if (loaded && !data) return <EmptyState />;

  const total = data?.mensagens.length ?? 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-secondary/40 to-secondary/10 pb-16">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl shadow-sm">
        <div className="container flex h-14 items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => router.push("/painel")} className="hover:bg-primary/10">
              <ArrowLeft className="size-4" />
            </Button>
            <div className="hidden sm:block"><Logo /></div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => router.push("/historico")} title="Meus scripts">
              <FileText className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDownload} title="Baixar">
              <Download className="size-4" />
            </Button>
            <Button size="icon" onClick={handleCopyAll} title="Copiar tudo" className="bg-primary/10 hover:bg-primary/20 text-primary">
              {copied === "__all__" ? <Check className="size-4" /> : <ClipboardCopy className="size-4" />}
            </Button>
            {email && <Button variant="ghost" size="icon" onClick={signOut} title={email}><LogOut className="size-4" /></Button>}
          </div>
        </div>
      </header>

      {/* HERO */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/[0.07] via-primary/[0.02] to-transparent pt-12 pb-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15),transparent_50%)]" />
        <div className="container relative max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/20 to-emerald-600/20 px-4 py-1.5 text-xs font-semibold text-primary shadow-sm ring-1 ring-primary/10">
            <Sparkles className="size-3.5" /> Seu kit está pronto
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-primary via-emerald-500 to-primary bg-clip-text text-transparent">{total} mensagens</span>
            <br /><span className="text-foreground/80">prontas pra usar</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">Cole nas respostas rápidas do WhatsApp Business e use com um toque.</p>
          <div className="mt-6 flex justify-center gap-6 sm:gap-10">
            <div className="text-center"><p className="text-2xl font-bold text-primary">{total}</p><p className="text-[11px] text-muted-foreground uppercase tracking-wider">Mensagens</p></div>
            <div className="w-px bg-border/60" />
            <div className="text-center"><p className="text-2xl font-bold text-primary">{grouped.length}</p><p className="text-[11px] text-muted-foreground uppercase tracking-wider">Categorias</p></div>
            <div className="w-px bg-border/60" />
            <div className="text-center"><p className="text-2xl font-bold text-primary">5 min</p><p className="text-[11px] text-muted-foreground uppercase tracking-wider">Configuração</p></div>
          </div>
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <Button onClick={handleCopyAll} className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
              {copied === "__all__" ? <Check className="size-4" /> : <ClipboardCopy className="size-4" />} Copiar todas
            </Button>
            <Button variant="outline" onClick={() => setGuiaAberto(true)} className="transition-all hover:shadow-md">
              <BookOpen className="size-4" /> Como instalar
            </Button>
          </div>
        </div>
      </div>

      <div className="container max-w-3xl py-8 space-y-10">

        {/* ─── GUIA VISUAL ─── */}
        <Collapsible open={guiaAberto} onOpenChange={setGuiaAberto}>
          <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/[0.03] to-background shadow-sm overflow-hidden">
            <CollapsibleTrigger asChild>
              <button className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-primary/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/10">
                    <Smartphone className="size-4 text-primary" />
                  </div>
                  <span className="font-semibold text-sm">Como usar no WhatsApp</span>
                </div>
                <ChevronDown className={`size-4 text-muted-foreground transition-transform duration-300 ${guiaAberto ? "rotate-180" : ""}`} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 pb-6 space-y-5">
                {/* Toggle */}
                <div className="relative flex rounded-lg bg-muted/80 p-0.5 shadow-inner">
                  <div className={`absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-md bg-gradient-to-r from-primary to-emerald-600 shadow-sm transition-all duration-300 ease-out ${modoGuia === "comum" ? "translate-x-[calc(100%+2px)]" : "translate-x-0"}`} />
                  <button onClick={() => setModoGuia("business")} className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-colors ${modoGuia === "business" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                    <Store className="size-3.5" /> WhatsApp Business
                  </button>
                  <button onClick={() => setModoGuia("comum")} className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-colors ${modoGuia === "comum" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                    <MessageCircle className="size-3.5" /> WhatsApp normal
                  </button>
                </div>

                {/* Steps visually */}
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/30 via-primary/20 to-transparent" />
                  <div className="space-y-4">
                    {GUIAS[modoGuia].map((passo, idx) => (
                      <div key={idx} className="relative flex gap-4">
                        <div className="relative shrink-0 z-10">
                          {GUIDE_ICONS[passo.icon]}
                        </div>
                        <div className="min-w-0 pt-1">
                          <p className="text-sm font-semibold">{passo.title}</p>
                          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{passo.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dicas */}
                <div className="rounded-xl border bg-background/80 p-4">
                  <p className="text-xs font-semibold flex items-center gap-1.5 mb-3"><Lightbulb className="size-3.5 text-primary" /> Dicas</p>
                  <ul className="space-y-2">
                    {["Customize com o nome do cliente antes de enviar.", "Teste cada script e veja qual funciona melhor.", "Edite e adapte os scripts com o tempo."].map((dica) => (
                      <li key={dica} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Check className="size-3 mt-0.5 shrink-0 text-primary/70" />
                        <span>{dica}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* FAQ */}
                <Collapsible open={faqAberto} onOpenChange={setFaqAberto}>
                  <CollapsibleTrigger className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <HelpCircle className="size-3.5" /> Perguntas frequentes
                    <ChevronRight className={`size-3 transition-transform ${faqAberto ? "rotate-90" : ""}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 space-y-1.5">
                      {[
                        { q: "O que são esses atalhos tipo /caro?", r: "São códigos que você digita pra aparecer a mensagem pronta. Ex: digite /caro e a resposta aparece automática." },
                        { q: "Preciso pagar o WhatsApp Business?", r: "Não! É totalmente gratuito. Baixe na loja do seu celular." },
                        { q: "Vou perder minhas conversas instalando o Business?", r: "Não. Suas conversas aparecem no Business automaticamente." },
                        { q: "Posso usar no computador?", r: "Sim! No WhatsApp Web as respostas rápidas funcionam igual." },
                        { q: "E se eu errar na configuração?", r: "Sem problema! Você pode editar ou apagar qualquer resposta depois." },
                      ].map((item) => (
                        <div key={item.q} className="rounded-lg bg-muted/30 p-2.5">
                          <p className="text-[11px] font-medium">{item.q}</p>
                          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{item.r}</p>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* ─── SCRIPTS EM ACORDEÃO ─── */}
        {grouped.map((group) => (
          <section key={group.categoria}>
            {/* Category header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/10">
                {getCategoriaIcon(group.categoria)}
              </div>
              <h2 className="text-base font-bold">{group.label}</h2>
              <span className="ml-auto rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">{group.itens.length}</span>
            </div>

            <div className="space-y-2">
              {group.itens.map((m) => {
                const id = m.atalho + m.titulo;
                const isOpen = expandedCard === id;
                return (
                  <div
                    key={id}
                    className={`rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                      isOpen
                        ? "border-primary/30 shadow-lg shadow-primary/5 bg-card"
                        : "border-border/60 bg-card/60 hover:border-border hover:shadow-sm hover:-translate-y-0.5"
                    }`}
                    onClick={() => toggleCard(id)}
                  >
                    {/* Always visible — header */}
                    <div className="flex items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0 flex items-center gap-2.5">
                        <div className={`flex size-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                          isOpen
                            ? "bg-gradient-to-br from-primary to-emerald-600 text-white shadow-sm"
                            : "bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-primary/20"
                        }`}>
                          {isOpen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
                        </div>
                        <p className={`text-sm font-semibold transition-colors ${isOpen ? "text-primary" : ""}`}>
                          {m.titulo}
                        </p>
                        <code className="shrink-0 rounded-md bg-gradient-to-r from-primary/10 to-primary/5 px-1.5 py-0.5 text-[10px] font-bold text-primary ring-1 ring-primary/20">
                          {m.atalho}
                        </code>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCopy(m.mensagem, id); }}
                          className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all ${
                            copied === id
                              ? "bg-primary/10 text-primary"
                              : "bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:shadow-sm"
                          }`}
                        >
                          {copied === id ? <><Check className="size-3.5" /> Copiado</> : <><Copy className="size-3.5" /> Copiar</>}
                        </button>
                        <ChevronDown className={`size-4 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                      </div>
                    </div>

                    {/* Expandable — message */}
                    <div className={`transition-all duration-300 ease-out overflow-hidden ${
                      isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                    }`}>
                      <div className="px-4 pb-4">
                        <div className="relative rounded-xl bg-gradient-to-br from-muted/40 to-muted/20 border border-border/30 p-4">
                          <div className="absolute -left-1.5 top-4 size-3 rotate-45 bg-gradient-to-br from-muted/40 to-muted/20 border-l border-t border-border/30" />
                          <p className="text-[13px] leading-relaxed text-foreground/85 whitespace-pre-line">{m.mensagem}</p>
                          <div className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
                            <Eye className="size-3" />
                            Digite <code className="bg-muted/60 px-1 rounded text-[10px] font-mono">{m.atalho}</code> no chat do WhatsApp
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {/* Footer */}
        <div className="rounded-xl border bg-gradient-to-br from-primary/[0.03] to-background p-6 text-center shadow-sm">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/10 mb-3">
            <Zap className="size-6 text-primary" />
          </div>
          <h3 className="text-base font-semibold">Tudo pronto!</h3>
          <p className="mt-1 max-w-sm mx-auto text-xs text-muted-foreground leading-relaxed">Copie cada mensagem e configure como resposta rápida no WhatsApp Business usando o atalho indicado.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/painel")}><ArrowLeft className="size-3.5" /> Voltar</Button>
            <Button size="sm" onClick={handleCopyAll}>{copied === "__all__" ? <Check className="size-3.5" /> : <ClipboardCopy className="size-3.5" />} Copiar tudo</Button>
          </div>
        </div>
      </div>
    </main>
  );
}

function EmptyState() {
  const router = useRouter();
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-b from-secondary/40 to-secondary/10 p-6">
      <Card className="max-w-md text-center shadow-xl border-none">
        <CardContent className="p-8 sm:p-10">
          <div className="mx-auto w-fit"><Logo /></div>
          <div className="mx-auto mt-6 flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/20">
            <FileText className="size-8 text-primary/50" />
          </div>
          <h1 className="mt-6 text-xl font-bold">Nenhum resultado encontrado</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">Volte ao painel e gere seu sistema personalizado.</p>
          <Button className="mt-8 shadow-lg shadow-primary/20" onClick={() => router.push("/painel")}><ArrowLeft className="size-4" /> Ir para o painel</Button>
        </CardContent>
      </Card>
    </main>
  );
}