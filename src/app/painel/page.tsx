"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  CreditCard,
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
  const [email, setEmail] = useState<string | null>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
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

  const saveProfile = useCallback(async (silent = false) => {
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
  }, [form]);

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
        try {
          const errBody = await res.json();
          console.log("[Paywall Debug]", errBody);
          if (errBody?.debug) {
            toast.error(
              `Debug: ${JSON.stringify(errBody.debug).slice(0, 200)}`,
              { duration: 15000 },
            );
          }
        } catch {}
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

  const preco = process.env.NEXT_PUBLIC_PRICE_BRL || "19,90";

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-secondary/20">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Logo />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {email && <span className="hidden sm:inline">{email}</span>}
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="size-4" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container max-w-5xl space-y-8 py-8">
        <div>
          <h1 className="text-3xl font-bold">Seu painel</h1>
          <p className="mt-1 text-muted-foreground">
            Configure seu negócio, veja o que vai receber e gere seus scripts
            quando estiver pronto.
          </p>
        </div>

        {/* Ferramentas preview */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">O que você vai ter</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TOOL_GROUPS.map((cat) => {
              const items = CATALOGO.filter((c) => c.categoria === cat);
              const unlocked = hasPaid;
              return (
                <Card
                  key={cat}
                  className={
                    unlocked
                      ? "border-primary/30"
                      : "border-dashed opacity-90"
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
                      {unlocked ? "liberado após gerar" : "desbloqueia ao pagar"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {items.slice(0, 3).map((i) => (
                        <li key={i.atalho} className="flex items-center gap-1">
                          <MessageSquareText className="size-3 shrink-0" />
                          {i.titulo}
                        </li>
                      ))}
                      {items.length > 3 && (
                        <li>+{items.length - 3} mensagens...</li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Formulário negócio */}
        <Card>
          <CardHeader>
            <CardTitle>Dados do seu negócio</CardTitle>
            <CardDescription>
              Salvo automaticamente na sua conta. Quanto mais completo, melhor o
              resultado.
              {saveStatus === "saving" && " · Salvando..."}
              {saveStatus === "saved" && " · Salvo na nuvem ✓"}
              {saveStatus === "error" && " · Erro ao salvar"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
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
              <Label>Tom de comunicação</Label>
              <Select
                value={form.tom}
                onValueChange={(v) => update("tom", v as Tom)}
              >
                <SelectTrigger>
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
            >
              {saving ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Save />
              )}
              Salvar dados
            </Button>
          </CardContent>
        </Card>

        {/* Gerar */}
        <Card className="border-primary/40 bg-primary/5">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Gerar meus scripts</h3>
              <p className="text-sm text-muted-foreground">
                {hasPaid
                  ? "Pagamento confirmado. Gere quantas vezes quiser nesta sessão."
                  : `Ao gerar, você confirma o acesso por R$ ${preco} (pagamento único).`}
              </p>
            </div>
            <Button size="xl" onClick={handleGenerate} disabled={generating}>
              {generating ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Sparkles />
              )}
              Gerar scripts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Paywall modal */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <CreditCard className="mx-auto size-10 text-primary" />
              <CardTitle>Desbloqueie seus scripts</CardTitle>
              <CardDescription>
                Seus dados já estão salvos. Pague uma vez para gerar o kit
                completo de mensagens personalizado.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-center text-3xl font-bold text-primary">
                R$ {preco}
              </p>
              <ul className="space-y-2 text-sm">
                {[
                  "+30 mensagens organizadas",
                  "Objeções, follow-up e fechamento",
                  "Copiar e colar no WhatsApp",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Check className="size-4 text-primary" /> {t}
                  </li>
                ))}
              </ul>
              <BuyButton size="xl" className="w-full">
                Pagar e gerar agora
              </BuyButton>
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
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
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
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={value}
        rows={2}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
