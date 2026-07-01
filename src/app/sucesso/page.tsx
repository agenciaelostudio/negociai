"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { toast } from "sonner";

type Status = "checking" | "paid" | "pending";

function SucessoContent() {
  const router = useRouter();
  const params = useSearchParams();
  const ref = params.get("ref");
  const [status, setStatus] = useState<Status>("checking");
  const [checking, setChecking] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [message, setMessage] = useState("");

  const check = useCallback(async () => {
    setChecking(true);
    setMessage("");
    try {
      if (!ref) {
        setMessage("O link de retorno não veio com o código de pagamento. Se você pagou, tente logar no painel diretamente — seu acesso pode já estar liberado.");
        setStatus("pending");
        return;
      }
      const qs = `?ref=${encodeURIComponent(ref)}`;
      const res = await fetch(`/api/payment-status${qs}`);
      const data: { paid?: boolean } = await res.json();
      if (data.paid) {
        setStatus("paid");
        setTimeout(() => router.push("/painel"), 1200);
      } else {
        setMessage("Pagamento ainda não identificado. Se você pagou via PIX, pode levar alguns minutos para confirmar. Clique em 'Verificar novamente' daqui a pouco.");
        setStatus("pending");
      }
    } catch {
      setMessage("Erro ao consultar pagamento. Tente novamente.");
      setStatus("pending");
    } finally {
      setChecking(false);
    }
  }, [ref, router]);

  const unlock = useCallback(async () => {
    setUnlocking(true);
    try {
      const res = await fetch("/api/unlock", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setStatus("paid");
        setTimeout(() => router.push("/painel"), 1200);
      } else {
        toast.error(data.error || "Não foi possível liberar. Tente novamente.");
      }
    } catch {
      toast.error("Erro ao liberar acesso. Tente novamente.");
    } finally {
      setUnlocking(false);
    }
  }, [router]);

  useEffect(() => {
    if (ref) check();
    else {
      setMessage("Link de retorno incompleto. Mas se você já pagou, seu acesso pode estar liberado — tente acessar o painel diretamente.");
      setStatus("pending");
    }
  }, []); // só executa uma vez no mount

  return (
    <main className="grid min-h-screen place-items-center bg-secondary/30 p-6">
      <Card className="max-w-md text-center">
        <CardContent className="p-8">
          <Logo className="mx-auto w-fit" />

          {status === "checking" && checking && (
            <>
              <Loader2 className="mx-auto mt-6 size-10 animate-spin text-primary" />
              <h1 className="mt-4 text-xl font-bold">Confirmando seu pagamento...</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Isso leva apenas alguns segundos.
              </p>
            </>
          )}

          {status === "paid" && (
            <>
              <CheckCircle2 className="mx-auto mt-6 size-12 text-primary" />
              <h1 className="mt-4 text-xl font-bold">Pagamento confirmado!</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Acesso liberado. Redirecionando para seu painel...
              </p>
            </>
          )}

          {status === "pending" && (
            <>
              <AlertCircle className="mx-auto mt-6 size-12 text-muted-foreground" />
              <h1 className="mt-4 text-xl font-bold">Ainda não identificamos o pagamento</h1>
              {message && (
                <p className="mt-2 text-sm text-muted-foreground">{message}</p>
              )}
              <div className="mt-6 flex flex-col gap-2">
                <Button onClick={check} disabled={checking}>
                  {checking ? (
                    <><Loader2 className="mr-2 size-4 animate-spin" /> Verificando...</>
                  ) : (
                    "Verificar novamente"
                  )}
                </Button>
                <Button variant="secondary" onClick={unlock} disabled={unlocking}>
                  {unlocking ? (
                    <><Loader2 className="mr-2 size-4 animate-spin" /> Liberando...</>
                  ) : (
                    "Já paguei, liberar meu acesso"
                  )}
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/painel">Ir para o painel</Link>
                </Button>
                <Button asChild variant="link" size="sm" className="text-xs text-muted-foreground">
                  <Link href="/">Voltar ao início</Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export default function SucessoPage() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </main>
      }
    >
      <SucessoContent />
    </Suspense>
  );
}
