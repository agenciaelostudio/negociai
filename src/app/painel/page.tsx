"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  CreditCard,
  FileText,
  Loader2,
  Lock,
  LogOut,
  MessageSquareText,
  Save,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { BuyButton } from "@/components/buy-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Logo } from "@/components/logo";
import { CATALOGO } from "@/lib/catalog";
import { EMPTY_PROFILE, type UserProfile } from "@/lib/profile";
import { createClient, isAuthEnabled } from "@/lib/supabase/client";
import {
  CATEGORIA_LABELS,
  type FormData,
  type GenerateResponse,
  type Tom,
} from "@/lib/types";

const TONS: Tom[] = ["Formal", "Profissional", "Amigável", "Premium"];
const RESULT_KEY = "negociai:result";
const FORM_KEY = "negociai:form";

const TOOL_GROUPS = [
  "apresentacao",
  "diferenciais",
  "valores",
  "info",
  "objecoes",
  "followup",
  "fechamento",
  "urgencia",
  "posvenda",
] as const;

export default function PainelPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [profileReady, setProfileReady] = useState(false);
  const [form, setForm] = useState<FormData>({
    nome: EMPTY_PROFILE.nome,
    profissao: EMPTY_PROFILE.profissao,
    servicos: EMPTY_PROFILE.servicos,
    preco: EMPTY_PROFILE.preco,
    diferenciais: EMPTY_PROFILE.diferenciais,
    objecoes: EMPTY_PROFILE.objecoes,
    tom: EMPTY_PROFILE.tom,
  });

  const loadProfile = useCallback(async () => {
    if (!isAuthEnabled()) {
      router.replace("/entrar");
      return;
    }

    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      router.replace("/entrar");
      return;
    }
    setEmail(auth.user.email ?? null);

    const res = await fetch("/api/profile");
    if (!res.ok) {
      toast.error("Não foi possível carregar seus dados.");
      setLoading(false);
      return;
    }

    const data: { profile: UserProfile } = await res.json();
    setForm({
      nome: data.profile.nome,
      profissao: data.profile.profissao,
      servicos: data.profile.servicos,
      preco: data.profile.preco,
      diferenciais: data.profile.diferenciais,
      objecoes: data.profile.objecoes,
      tom: data.profile.tom,
    });
    setHasPaid(data.profile.hasPaid);
    setProfileReady(true);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const saveProfile = useCallback(
    async (silent = false) => {
      setSaving(true);
      setSaveStatus("saving");
      try {
        const res = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("save");
        setSaveStatus("saved");
        if (!silent) toast.success("Dados salvos na sua conta.");
      } catch {
        setSaveStatus("error");
        if (!silent) toast.error("Não foi possível salvar. Tente novamente.");
      } finally {
        setSaving(false);
      }
    },
    [form],
  );

  useEffect(() => {
    if (!profileReady) return;
    const timer = setTimeout(() => {
      saveProfile(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, [form, profileReady, saveProfile]);

  async function handleGenerate() {
    if (!form.nome.trim() || !form.profissao.trim()) {
      toast.error("Preencha nome e profissão antes de gerar.");
      return;
    }
    await saveProfile();
    setGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.status === 402) {
        setShowPaywall(true);
        setGenerating(false);
        return;
      }
      if (!res.ok) throw new Error("generate");
      const data: GenerateResponse = await res.json();
      sessionStorage.setItem(RESULT_KEY, JSON.stringify(data));
      sessionStorage.setItem(FORM_KEY, JSON.stringify(form));
      router.push("/resultado");
    } catch {
      toast.error("Não foi possível gerar agora. Tente novamente.");
      setGenerating(false);
    }
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/entrar");
  }

  async function handleUnlock() {
    setUnlocking(true);
    try {
      const res = await fetch("/api/unlock", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        toast.success("Acesso liberado!");
        setHasPaid(true);
        setShowPaywall(false);
      } else {
        toast.error(data.error || "Não foi possível liberar. Tente novamente.");
      }
    } catch {
      toast.error("Erro ao liberar acesso.");
    } finally {
      setUnlocking(false);
    }
  }

  const preco = process.env.NEXT_PUBLIC_PRICE_BRL || "19,90";

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* ---- HEADER ---- */}
      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Logo />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/historico")}
            >
              <FileText className="size-4" />
              <span className="hidden sm:inline">Meus scripts</span>
            </Button>
            {email && (
              <span className="hidden sm:inline text-muted-foreground/70">
                {email}
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="size-4" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container max-w-6xl py-10">
        {/* ---- PAGE TITLE ---- */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Seu{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
              painel
            </span>
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Configure seu negócio, veja o que vai receber e gere seus scripts
            quando estiver pronto.
          </p>
        </div>

        {/* ---- TWO-COLUMN LAYOUT ---- */}
        <div className="grid gap-8 lg:grid-cols-5">
          {/* -------- LEFT COLUMN: FORM + GENERATE -------- */}
          <div className="space-y-8 lg:col-span-3">
            {/* Form section */}
            <div className="rounded-2xl border bg-secondary/20 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold">
                  Dados do seu negócio
                </h2>
                <p className="text-sm text-muted-foreground">
                  Salvo automaticamente na sua conta. Quanto mais completo,
                  melhor o resultado.
                  {saveStatus === "saving" && " · Salvando..."}
                  {saveStatus === "saved" && " · Salvo na nuvem ✓"}
                  {saveStatus === "error" && " · Erro ao salvar"}
                </p>
              </div>
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    id="nome"
                    label="Nome profissional"
                    value={form.nome}
                    onChange={(v) => update("nome", v)}
                    placeholder="Ex: Studio Camila Design"
                  />
                  <Field
                    id="profissao"
                    label="Profissão"
                    value={form.profissao}
                    onChange={(v) => update("profissao", v)}
                    placeholder="Ex: Designer gráfico"
                  />
                </div>
                <AreaField
                  id="servicos"
                  label="Serviços"
                  value={form.servicos}
                  onChange={(v) => update("servicos", v)}
                />
                <Field
                  id="preco"
                  label="Faixa de preço"
                  value={form.preco}
                  onChange={(v) => update("preco", v)}
                />
                <AreaField
                  id="diferenciais"
                  label="Diferenciais"
                  value={form.diferenciais}
                  onChange={(v) => update("diferenciais", v)}
                />
                <AreaField
                  id="objecoes"
                  label="Objeções frequentes"
                  value={form.objecoes}
                  onChange={(v) => update("objecoes", v)}
                />
                <div className="space-y-2">
                  <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Tom de comunicação
                  </Label>
                  <Select
                    value={form.tom}
                    onValueChange={(v) => update("tom", v as Tom)}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TONS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => saveProfile(false)}
                  disabled={saving}
                  className="rounded-xl"
                >
                  {saving ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Save />
                  )}
                  Salvar dados
                </Button>
              </div>
            </div>

            {/* Generate button — full width, gradient */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:from-primary/90 hover:to-emerald-600/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generating ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Sparkles className="size-5" />
              )}
              Gerar scripts
              {!hasPaid && (
                <span className="ml-1 text-sm font-normal text-white/80">
                  · R$ {preco}
                </span>
              )}
            </button>
            <p className="text-center text-xs text-muted-foreground">
              {hasPaid
                ? "Pagamento confirmado. Gere quantas vezes quiser."
                : `Ao gerar, você confirma o acesso por R$ ${preco} (pagamento único).`}
            </p>
          </div>

          {/* -------- RIGHT COLUMN: PREVIEW -------- */}
          <div className="space-y-6 lg:col-span-2">
            <div className="sticky top-24 rounded-2xl border bg-card p-6">
              <h3 className="mb-1 text-base font-semibold">
                Você vai receber:
              </h3>
              <p className="mb-4 text-xs text-muted-foreground">
                {TOOL_GROUPS.length} categorias de mensagens prontas para usar
              </p>
              <div className="grid grid-cols-1 gap-2">
                {TOOL_GROUPS.map((cat) => (
                  <div
                    key={cat}
                    className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2.5 text-sm font-medium text-green-700 dark:border-green-900/30 dark:bg-green-950/20 dark:text-green-400"
                  >
                    <Check className="size-4 shrink-0 text-green-600 dark:text-green-400" />
                    {CATEGORIA_LABELS[cat]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ---- TOOL PREVIEW CARDS ---- */}
        <section className="mt-12">
          <h2 className="mb-6 text-xl font-semibold">
            Kit completo de mensagens
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOL_GROUPS.map((cat) => {
              const items = CATALOGO.filter((c) => c.categoria === cat);
              const unlocked = hasPaid;
              return (
                <Card
                  key={cat}
                  className={
                    "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg " +
                    (unlocked
                      ? "border-primary/30"
                      : "border-dashed opacity-90")
                  }
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      {unlocked ? (
                        <Check className="size-4 text-primary" />
                      ) : (
                        <Lock className="size-4 text-muted-foreground" />
                      )}
                      {CATEGORIA_LABELS[cat]}
                    </CardTitle>
                    <CardDescription>
                      {items.length} mensagens ·{" "}
                      {unlocked
                        ? "liberado após gerar"
                        : "desbloqueia ao pagar"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {items.slice(0, 3).map((i) => (
                        <li
                          key={i.atalho}
                          className="flex items-center gap-1"
                        >
                          <MessageSquareText className="size-3 shrink-0" />
                          {i.titulo}
                        </li>
                      ))}
                      {items.length > 3 && (
                        <li className="text-muted-foreground/70">
                          +{items.length - 3} mensagens...
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>

      {/* ---- PAYWALL MODAL ---- */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <CardHeader className="pb-2 text-center">
              <div className="mx-auto mb-2 flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-emerald-600">
                <CreditCard className="size-7 text-white" />
              </div>
              <CardTitle className="text-2xl">
                <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                  Desbloqueie seus scripts
                </span>
              </CardTitle>
              <CardDescription>
                Seus dados já estão salvos. Pague uma vez para gerar o kit
                completo de mensagens personalizado.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-center text-4xl font-bold">
                <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                  R$ {preco}
                </span>
              </p>
              <ul className="space-y-2 text-sm">
                {[
                  "+50 mensagens organizadas",
                  "Objeções, follow-up e fechamento",
                  "Copiar e colar no WhatsApp",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Check className="size-4 text-green-600" /> {t}
                  </li>
                ))}
              </ul>
              <BuyButton
                size="xl"
                className="w-full rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90"
              >
                Pagar e gerar agora
              </BuyButton>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleUnlock}
                disabled={unlocking}
              >
                {unlocking ? (
                  <><Loader2 className="mr-2 size-4 animate-spin" /> Liberando...</>
                ) : (
                  "Já paguei, liberar meu acesso"
                )}
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setShowPaywall(false)}
              >
                Voltar ao painel
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                PIX ou cartão · acesso imediato após confirmação
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}

/* ── helper components ── */

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl"
      />
    </div>
  );
}

function AreaField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </Label>
      <Textarea
        id={id}
        value={value}
        rows={2}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl"
      />
    </div>
  );
}