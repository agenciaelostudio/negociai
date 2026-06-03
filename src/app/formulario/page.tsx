"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";

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
import type { FormData, GenerateResponse, Tom } from "@/lib/types";

const TONS: Tom[] = ["Formal", "Profissional", "Amigável", "Premium"];

const RESULT_KEY = "negociai:result";
const FORM_KEY = "negociai:form";

export default function FormularioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    nome: "",
    profissao: "",
    servicos: "",
    preco: "",
    diferenciais: "",
    objecoes: "",
    tom: "Profissional",
  });

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome.trim() || !form.profissao.trim()) {
      toast.error("Preencha pelo menos seu nome e profissão.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.status === 402) {
        toast.error("É necessário concluir o pagamento para gerar.");
        const checkout = await fetch("/api/checkout", { method: "POST" });
        const cdata: { url?: string } = await checkout.json();
        if (cdata.url) {
          window.location.href = cdata.url;
          return;
        }
        throw new Error("payment");
      }
      if (!res.ok) throw new Error("Falha na geração");
      const data: GenerateResponse = await res.json();
      sessionStorage.setItem(RESULT_KEY, JSON.stringify(data));
      sessionStorage.setItem(FORM_KEY, JSON.stringify(form));
      router.push("/resultado");
    } catch {
      toast.error("Não foi possível gerar agora. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-secondary/30">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft /> Voltar
            </Link>
          </Button>
        </div>
      </header>

      <div className="container max-w-2xl py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Vamos montar seu NegociAí</h1>
          <p className="mt-2 text-muted-foreground">
            Responda algumas perguntas. Em segundos geramos seu sistema completo
            de negociação.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Seus dados</CardTitle>
            <CardDescription>
              Quanto mais detalhes, mais personalizadas serão as mensagens.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Field
                id="nome"
                label="Nome profissional"
                placeholder="Ex: João Silva Fotografia"
                value={form.nome}
                onChange={(v) => update("nome", v)}
                required
              />
              <Field
                id="profissao"
                label="Profissão"
                placeholder="Ex: Fotógrafo de casamentos"
                value={form.profissao}
                onChange={(v) => update("profissao", v)}
                required
              />
              <AreaField
                id="servicos"
                label="Serviços oferecidos"
                placeholder="Ex: Cobertura de casamentos, ensaios, eventos corporativos..."
                value={form.servicos}
                onChange={(v) => update("servicos", v)}
              />
              <Field
                id="preco"
                label="Faixa de preço"
                placeholder="Ex: De R$ 1.500 a R$ 4.000"
                value={form.preco}
                onChange={(v) => update("preco", v)}
              />
              <AreaField
                id="diferenciais"
                label="Diferenciais"
                placeholder="Ex: 10 anos de experiência, entrega rápida, álbum incluso..."
                value={form.diferenciais}
                onChange={(v) => update("diferenciais", v)}
              />
              <AreaField
                id="objecoes"
                label="Principais objeções recebidas"
                placeholder="Ex: Acham caro, querem desconto, vão pensar..."
                value={form.objecoes}
                onChange={(v) => update("objecoes", v)}
              />

              <div className="space-y-2">
                <Label htmlFor="tom">Tom de comunicação</Label>
                <Select
                  value={form.tom}
                  onValueChange={(v) => update("tom", v as Tom)}
                >
                  <SelectTrigger id="tom">
                    <SelectValue placeholder="Selecione o tom" />
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
                type="submit"
                size="xl"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" /> Gerando seu sistema...
                  </>
                ) : (
                  <>
                    <Sparkles /> GERAR MEU NEGOCIAÍ
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function Field({
  id,
  label,
  placeholder,
  value,
  onChange,
  required,
}: {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <Input
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function AreaField({
  id,
  label,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
      />
    </div>
  );
}
