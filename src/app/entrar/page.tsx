"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, Loader2, LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import {
  validateEmail,
  validatePasswordPair,
} from "@/lib/auth-validation";
import { createClient, isAuthEnabled } from "@/lib/supabase/client";

type Mode = "cadastro" | "login";

function GoogleIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function EntrarPage() {
  const router = useRouter();
  const params = useSearchParams();
  const authOn = isAuthEnabled();
  const [mode, setMode] = useState<Mode>("cadastro");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState<"google" | "form" | null>(null);
  const [awaitingConfirm, setAwaitingConfirm] = useState(false);

  useEffect(() => {
    if (params.get("erro") === "auth") {
      toast.error("Não foi possível entrar. Tente novamente.");
    }
  }, [params]);

  useEffect(() => {
    if (!authOn) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace("/painel");
    });
  }, [authOn, router]);

  async function signInGoogle() {
    if (!authOn) return;
    setLoading("google");
    const supabase = createClient();
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=/painel`,
      },
    });
    if (error) {
      toast.error(error.message);
      setLoading(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!authOn) return;

    const emailErr = validateEmail(email);
    if (emailErr) {
      toast.error(emailErr);
      return;
    }

    if (mode === "cadastro") {
      const passErr = validatePasswordPair(password, confirmPassword);
      if (passErr) {
        toast.error(passErr);
        return;
      }
    } else if (!password) {
      toast.error("Informe sua senha.");
      return;
    }

    setLoading("form");
    const supabase = createClient();

    if (mode === "cadastro") {
      const origin =
        process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=/painel`,
        },
      });

      if (error) {
        toast.error(
          error.message.includes("already registered")
            ? "Este e-mail já está cadastrado. Faça login."
            : error.message,
        );
        setLoading(null);
        return;
      }

      if (data.session) {
        toast.success("Conta criada com sucesso!");
        router.push("/painel");
        return;
      }

      setAwaitingConfirm(true);
      setLoading(null);
      toast.success("Conta criada! Confirme o e-mail para entrar.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      toast.error(
        error.message.includes("Invalid login")
          ? "E-mail ou senha incorretos."
          : error.message,
      );
      setLoading(null);
      return;
    }

    toast.success("Bem-vindo de volta!");
    router.push("/painel");
  }

  if (!authOn) {
    return (
      <main className="min-h-screen bg-secondary/30">
        <header className="border-b bg-background">
          <div className="container flex h-16 items-center">
            <Link href="/">
              <Logo />
            </Link>
          </div>
        </header>
        <div className="container max-w-md py-16 text-center">
          <h1 className="text-2xl font-bold">Cadastro indisponível</h1>
          <p className="mt-3 text-muted-foreground">
            O Supabase está no projeto, mas faltam as variáveis na{" "}
            <strong>Vercel</strong> (não só no painel Supabase).
          </p>
          <ul className="mt-4 space-y-2 text-left text-sm text-muted-foreground">
            <li>• NEXT_PUBLIC_SUPABASE_URL</li>
            <li>• NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
            <li>• SUPABASE_SERVICE_ROLE_KEY</li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Supabase → Project Settings → API. Depois rode{" "}
            <code className="rounded bg-muted px-1">.\scripts\finalizar-supabase.ps1</code>{" "}
            e faça redeploy.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">Voltar ao início</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-secondary/30">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center">
          <Link href="/">
            <Logo />
          </Link>
        </div>
      </header>

      <div className="container flex max-w-md flex-col py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            {mode === "cadastro" ? "Criar conta" : "Entrar"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Seus dados ficam salvos na nuvem. Pague só quando for gerar os
            scripts.
          </p>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 rounded-lg border bg-muted/40 p-1">
          <Button
            type="button"
            variant={mode === "cadastro" ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setMode("cadastro");
              setAwaitingConfirm(false);
            }}
          >
            <UserPlus className="size-4" /> Cadastrar
          </Button>
          <Button
            type="button"
            variant={mode === "login" ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setMode("login");
              setAwaitingConfirm(false);
            }}
          >
            <LogIn className="size-4" /> Entrar
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {mode === "cadastro"
                ? "E-mail e senha definitivos"
                : "Acesse sua conta"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              size="lg"
              onClick={signInGoogle}
              disabled={loading !== null}
            >
              {loading === "google" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              Continuar com Google
            </Button>

            <div className="relative text-center text-xs text-muted-foreground">
              <span className="bg-card px-2">ou</span>
              <div className="absolute inset-x-0 top-1/2 -z-10 border-t" />
            </div>

            {awaitingConfirm ? (
              <div className="rounded-lg border bg-accent/40 p-4 text-center text-sm">
                <p className="font-medium">Confirme seu e-mail</p>
                <p className="mt-2 text-muted-foreground">
                  Enviamos um link para <strong>{email}</strong>. Após confirmar,
                  volte aqui e clique em <strong>Entrar</strong>.
                </p>
                <Button
                  className="mt-4 w-full"
                  variant="outline"
                  onClick={() => {
                    setMode("login");
                    setAwaitingConfirm(false);
                  }}
                >
                  Ir para login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete={
                      mode === "cadastro" ? "new-password" : "current-password"
                    }
                    placeholder="Mínimo 8 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={mode === "cadastro" ? 8 : 1}
                  />
                </div>
                {mode === "cadastro" && (
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Confirmar senha</Label>
                    <Input
                      id="confirm"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Repita a senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading !== null}
                >
                  {loading === "form" ? (
                    <Loader2 className="animate-spin" />
                  ) : mode === "cadastro" ? (
                    <UserPlus />
                  ) : (
                    <KeyRound />
                  )}
                  {mode === "cadastro" ? "Criar minha conta" : "Entrar"}
                </Button>
              </form>
            )}

            <p className="text-center text-xs text-muted-foreground">
              Conta segura · dados salvos no banco · pagamento só ao gerar
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
