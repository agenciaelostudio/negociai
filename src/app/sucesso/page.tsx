"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/logo";

type Status = "checking" | "paid" | "pending";

function SucessoContent() {
  const router = useRouter();
  const params = useSearchParams();
  const ref = params.get("ref");
  const [status, setStatus] = useState<Status>("checking");
  const [attempts, setAttempts] = useState(0);

  const check = useCallback(async () => {
    try {
      const qs = ref ? `?ref=${encodeURIComponent(ref)}` : "";
      const res = await fetch(`/api/payment-status${qs}`);
      const data: { paid?: boolean } = await res.json();
      if (data.paid) {
        setStatus("paid");
        setTimeout(() => router.push("/formulario"), 1200);
      } else {
        setStatus("pending");
      }
    } catch {
      setStatus("pending");
    }
  }, [ref, router]);

  useEffect(() => {
    check();
  }, [check, attempts]);

  // Re-tenta automaticamente algumas vezes (o pagamento pode levar segundos).
  useEffect(() => {
    if (status !== "pending") return;
    if (attempts >= 8) return;
    const t = setTimeout(() => setAttempts((a) => a + 1), 4000);
    return () => clearTimeout(t);
  }, [status, attempts]);

  return (
    <main className="grid min-h-screen place-items-center bg-secondary/30 p-6">
      <Card className="max-w-md text-center">
        <CardContent className="p-8">
          <Logo className="mx-auto w-fit" />

          {status === "checking" && (
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
                Acesso liberado. Redirecionando para o formulário...
              </p>
            </>
          )}

          {status === "pending" && (
            <>
              <XCircle className="mx-auto mt-6 size-12 text-muted-foreground" />
              <h1 className="mt-4 text-xl font-bold">Ainda não identificamos o pagamento</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Se você acabou de pagar via PIX, aguarde alguns instantes e
                tente novamente.
              </p>
              <div className="mt-6 flex flex-col gap-2">
                <Button onClick={() => setAttempts((a) => a + 1)}>
                  Verificar novamente
                </Button>
                <Button asChild variant="ghost">
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
