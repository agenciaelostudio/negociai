"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  FileText,
  Loader2,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { createClient } from "@/lib/supabase/client";

interface Generation {
  id: string;
  profession: string;
  created_at: string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min atrás`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d atrás`;
  return formatDate(iso);
}

export default function HistoricoPage() {
  const router = useRouter();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: auth }) => {
      setEmail(auth.user?.email ?? null);
    });

    fetch("/api/generations")
      .then((res) => {
        if (res.status === 401) {
          router.replace("/entrar");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setGenerations(data.generations ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/entrar");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-secondary/40 to-secondary/10 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl shadow-sm">
        <div className="container flex h-16 items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/painel")}
              className="hover:bg-primary/10 transition-colors"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Voltar ao painel</span>
            </Button>
            <div className="hidden sm:block">
              <Logo />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {email && (
              <Button variant="ghost" size="sm" onClick={signOut} title={email}>
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container max-w-3xl py-10 space-y-8">
        {/* Title section */}
        <div className="relative">
          <div className="absolute -inset-x-4 -inset-y-6 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent rounded-2xl opacity-50 blur-xl" />
          <div className="relative flex items-center gap-4">
            <div className="shrink-0 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-emerald-600 shadow-lg shadow-primary/20">
              <FileText className="size-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Meus scripts salvos
              </h1>
              <p className="mt-1 text-muted-foreground">
                Seus kits de mensagens gerados anteriormente
              </p>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="relative">
              <Loader2 className="size-10 animate-spin text-primary" />
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
            </div>
            <p className="text-sm text-muted-foreground animate-pulse">
              Carregando seus kits...
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && generations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/20">
              <FileText className="size-10 text-primary/60" />
            </div>
            <h2 className="text-xl font-semibold">Nenhum script salvo</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm text-center">
              Você ainda não gerou nenhum kit de mensagens. Crie seu primeiro
              kit personalizado agora mesmo.
            </p>
            <Button
              className="mt-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              onClick={() => router.push("/painel")}
            >
              <Sparkles className="size-4" />
              Gerar meu primeiro kit
            </Button>
          </div>
        )}

        {/* Cards */}
        {!loading && generations.length > 0 && (
          <div className="space-y-4">
            {generations.map((gen, idx) => (
              <Card
                key={gen.id}
                className="group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 border-border/50 hover:border-primary/30 bg-card/90 backdrop-blur-sm overflow-hidden"
                onClick={() => router.push(`/resultado?id=${gen.id}`)}
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <CardContent className="flex items-center gap-4 p-5 sm:p-6">
                  {/* Gradient icon with subtle glow */}
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/30 to-emerald-600/30 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-emerald-600/10 ring-1 ring-primary/20 group-hover:from-primary/30 group-hover:to-emerald-600/20 group-hover:ring-primary/30 transition-all">
                      <Sparkles className="size-5 text-primary" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate group-hover:text-primary transition-colors text-base">
                      {gen.profession || "Kit de mensagens"}
                    </p>
                    <div className="mt-1.5 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="size-3.5" />
                        {formatDate(gen.created_at)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        {timeAgo(gen.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Arrow with animated movement */}
                  <div className="shrink-0 flex size-9 items-center justify-center rounded-full bg-primary/0 group-hover:bg-primary/10 group-hover:shadow-sm transition-all">
                    <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}